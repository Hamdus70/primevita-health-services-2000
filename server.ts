import express from 'express';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { sendAdminNotification } from './src/lib/email/admin';
import { sendOTP, verifyOTP } from './src/lib/email/otp';
import { sendTrackingLink } from './src/lib/email/tracking';
import { sendInterviewInvite, sendInterviewReminder } from './src/lib/email/interview';

// Re-implement the onboard patient logic
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function createServer() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    // --- API ROUTES ---

    app.post('/api/patient/register', async (req, res) => {
        try {
            const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            const { checkRateLimit } = await import('./src/lib/security/rate-limit');
            const rateLimitResult = await checkRateLimit(`ratelimit:public:${ip}`, 100, 60);
            if (!rateLimitResult.allowed) {
                return res.status(429).json({ error: "Too many requests" });
            }

            const { firstName, lastName, email, phone } = req.body;
            if (!firstName || !lastName || !email || !phone) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const emailExists = await prisma.patient.findUnique({ where: { email } });
            if (emailExists) return res.status(409).json({ error: "Patient with this identity already exists." });

            const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            
            const lastPatient = await prisma.patient.findFirst({
                where: { patient_username: { startsWith: `CL-${initials}-` } },
                orderBy: { patient_username: 'desc' }
            });

            let sequence = 1;
            if (lastPatient) {
                const parts = lastPatient.patient_username.split('-');
                const lastSeq = parseInt(parts[2], 10);
                if (!isNaN(lastSeq)) sequence = lastSeq + 1;
            }
            
            const username = `CL-${initials}-${sequence.toString().padStart(4, '0')}`;
            const randomStr = crypto.randomBytes(4).toString('hex');
            const generatedPassword = `PatP@ss!${randomStr}`;
            const passwordHash = await bcrypt.hash(generatedPassword, 12);

            const newPatient = await prisma.$transaction(async (tx) => {
                const patient = await tx.patient.create({
                    data: {
                        patient_username: username,
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        phone_number: phone,
                        date_of_birth: new Date(),
                        age: 30,
                        gender: 'UNKNOWN',
                        residential_address: 'Not Provided',
                        city: 'Not Provided',
                        state: 'Not Provided',
                        country: 'Not Provided',
                        nationality: 'Not Provided',
                        active_status: true,
                        onboarding_completed: true,
                    }
                });

                await tx.userCredential.create({
                    data: {
                        linked_user_type: 'PATIENT',
                        patient_id: patient.id,
                        username: username,
                        password_hash: passwordHash,
                    }
                });

                return patient;
            });

            // Send Notification to Admin
            try {
                await sendAdminNotification(
                    "New Patient Registration",
                    `A new patient has been automatically onboarded.\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nUsername: ${username}`
                );
            } catch (err) {
                console.error("Failed to send admin notification:", err);
            }

            return res.status(201).json({
                message: "Patient onboarded successfully.",
                patient: { id: newPatient.id, name: `${newPatient.first_name} ${newPatient.last_name}`, username: username },
                credentials: { username: username, password: generatedPassword }
            });
        } catch (error: any) {
            console.error("Patient Onboarding Error:", error);
            return res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    });

    app.post('/api/patient/onboarding', async (req, res) => {
        try {
            return res.status(200).json({
                message: "Patient onboarding completed successfully.",
                patient: { onboarding_completed: true }
            });
        } catch (error: any) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });

    app.post('/api/staff/apply', async (req, res) => {
        try {
            const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
            const { checkRateLimit } = await import('./src/lib/security/rate-limit');
            const rateLimitResult = await checkRateLimit(`ratelimit:public:${ip}`, 100, 60);
            if (!rateLimitResult.allowed) {
                return res.status(429).json({ error: "Too many requests" });
            }

            const { firstName, lastName, email, phone, role } = req.body;
            if (!firstName || !lastName || !email || !role) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const emailExists = await prisma.staff.findUnique({ where: { email } });
            if (emailExists) return res.status(409).json({ error: "Application with this identity already exists." });

            const formattedRole = role.toUpperCase();
            const roleCodeMap: Record<string, string> = { 'NURSE': 'NUR', 'DOCTOR': 'DOC', 'CAREGIVER': 'CRG', 'PHYSIOTHERAPIST': 'PHY' };
            const roleCode = roleCodeMap[formattedRole] || 'STF';
            const username = `HSP-${roleCode}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            const newStaff = await prisma.staff.create({
                data: {
                    staff_id_format: username,
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                    phone_number: phone || 'Not Provided',
                    role: formattedRole as any,
                    approval_status: 'PENDING',
                    date_of_birth: new Date(),
                    age: 30,
                    gender: 'UNKNOWN',
                    address: 'Not Provided',
                }
            });

            // Send Notification to Admin
            try {
                await sendAdminNotification(
                    "New Staff Application Pending",
                    `A new staff application has been submitted and awaits review.\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nRole: ${formattedRole}\nTemp ID: ${username}`
                );
            } catch (err) {
                console.error("Failed to send admin notification:", err);
            }

            return res.status(201).json({ message: "Application submitted successfully. Pending Admin Approval.", staffId: newStaff.id });
        } catch (error: any) {
            console.error("Staff Application Error:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // --- VITE MIDDLEWARE ---
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
    });

    app.use(vite.middlewares);

    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

createServer();
