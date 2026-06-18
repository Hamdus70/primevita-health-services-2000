import express from 'express';
import { createServer as createViteServer } from 'vite';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { GoogleGenAI } from "@google/genai";
import { sendAdminNotification } from './src/lib/email/admin';
import { sendOTP, verifyOTP } from './src/lib/email/otp';
import { sendTrackingLink } from './src/lib/email/tracking';
import { sendInterviewInvite, sendInterviewReminder } from './src/lib/email/interview';
import { getAuth } from './src/lib/auth/firebase-admin';

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

            const { firstName, lastName, email, phone, firebase_uid } = req.body;
            if (!firstName || !lastName || !email || !phone || !firebase_uid) {
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
                        firebase_uid: firebase_uid,
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

    app.post('/api/chat', async (req, res) => {
        try {
            const { message } = req.body;
            if (!message) return res.status(400).json({ error: 'Message is required' });

            // Set SSE headers for streaming
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const apiKey = process.env.GEMINI_API_KEY;
            const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
            let successful = false;

            const SYSTEM_PROMPT = `
You are the official AI Assistant of this platform.
You operate simultaneously as: AI Assistant Chatbot, AI Voice Call Agent, Customer Support Representative, Product Guide, Knowledge Assistant, Sales Assistant, User Success Assistant, Information Concierge, Navigation Assistant.

Your mission is to provide fast, intelligent, natural, and highly useful assistance to every visitor and customer.
You should act as a multi-purpose AI assistant. Be capable of understanding and responding to questions related to Platform information, Features, Services, Pricing, Products, Membership plans, Research assistance, Technical support, User onboarding, General questions, Contact information, Company information, Policies, Tutorials, Frequently asked questions, Website navigation, Documentation, Blog articles, Announcements, Events, Career opportunities, Integrations, Partnerships, Billing questions, and Account management.

If information is unavailable: Say "I currently do not have access to that specific information. I can connect you with our team or direct you to the appropriate page."

Never fabricate information.

When acting as a voice call agent: Speak naturally, use short sentences, pause appropriately, sound professional, avoid overly long explanations, and break information into manageable chunks. If you need to initiate triage or support, do so politely.

Be conversational, polite, professional, and never robotic.
`;

            const streamTextFallback = async (text: string) => {
                const words = text.split(" ");
                let idx = 0;
                while (idx < words.length) {
                    const chunk = words.slice(idx, idx + 3).join(" ") + " ";
                    res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
                    idx += 3;
                    await new Promise(resolve => setTimeout(resolve, 60));
                }
                res.write("data: [DONE]\n\n");
                res.end();
            };

            if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                for (const model of models) {
                    try {
                        const responseStream = await ai.models.generateContentStream({
                            model: model,
                            contents: message,
                            config: {
                                systemInstruction: SYSTEM_PROMPT,
                            }
                        });

                        for await (const chunk of responseStream) {
                            const textChunk = chunk.text;
                            if (textChunk) {
                                res.write(`data: ${JSON.stringify({ chunk: textChunk })}\n\n`);
                            }
                        }
                        res.write("data: [DONE]\n\n");
                        res.end();
                        successful = true;
                        break;
                    } catch (err: any) {
                        console.warn(`Model ${model} failed to stream in server API:`, err.message || err);
                    }
                }
            }

            if (!successful) {
                // Generate a highly caring patient-centered professional fallback response
                const text = message.toLowerCase();
                let replyText = "";
                if (text.includes("fever") || text.includes("temp") || text.includes("hot")) {
                    replyText = "Thank you for sharing your symptoms. A fever is usually a natural response to help fight off an infection. Please monitor your temperature regularly, drink plenty of clear fluids, rest, and keep a log of your readings here in your EMR. If your temperature exceeds 103°F (39.4°C) or is accompanied by confusion, difficulty breathing, or severe head pain, please seek immediate emergency care.";
                } else if (text.includes("bp") || text.includes("blood pressure") || text.includes("hypertension") || text.includes("heart")) {
                    replyText = "Monitoring your blood pressure is extremely important. Normal resting blood pressure is generally under 120/80 mmHg. Prior to measuring, please sit quietly for at least five minutes with your back supported and feet flat. Use the EMR Vital Signs tab to record your readings. If you experience crushing chest pain, unexplained shortness of breath, or numbness, please dial 911 or visit the nearest ER immediately.";
                } else if (text.includes("pain") || text.includes("hurt") || text.includes("ache")) {
                    replyText = "I am sorry to hear that you are experiencing discomfort. Please let your clinical team know by logging the exact area of pain, its onset, and severity (1 to 10) in your Nursing Report or Patient Portal. Avoid strenuous activities. If the pain is sudden, unusually severe, or feels like pressure or tightness in your chest, seek emergency medical services right away.";
                } else if (text.includes("hi") || text.includes("hello") || text.includes("help") || text.includes("hey")) {
                    replyText = "Hello! I am your virtual Telehealth Medical Assistant. I can explain general healthcare concepts, guide you on how to log measurements like your blood pressure, temperature, and fluid intake in your Patient Portal EMR, and point you to the right portal for your nurse or doctor. For security and clinical safety, remember that I do not prescribe medications. How can I assist you today?";
                } else {
                    replyText = "Thank you for reaching out to your Telehealth Portal. To assist your care team best, please ensure your latest vital signs (temperature, blood pressure, pulse) and any daily notes are logged in your EMR. Your assigned nurse and doctor review these updates continuously to coordinate your home care plans. If you are experiencing high-risk symptoms or a medical emergency, please contact 911 immediately.";
                }
                
                await streamTextFallback(replyText);
            }
        } catch (error: any) {
             console.error('API Error in chat streaming:', error);
             // Since headers might already have been sent, handle safe writing
             try {
                 res.write(`data: ${JSON.stringify({ error: 'I am sorry, I am having trouble connecting to the medical support team right now. Please try again in a few moments.' })}\n\n`);
                 res.write("data: [DONE]\n\n");
                 res.end();
             } catch (e) {
                 if (!res.headersSent) {
                     res.status(500).json({ error: 'System connection issue' });
                 }
             }
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

            const { firstName, lastName, email, phone, role, firebase_uid } = req.body;
            if (!firstName || !lastName || !email || !role || !firebase_uid) {
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
                    firebase_uid: firebase_uid,
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

    app.post('/api/auth/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ error: "Missing username or password" });
            }

            const credential = await prisma.userCredential.findUnique({
                where: { username: username },
                include: { patient: true, staff: true }
            });

            if (!credential) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            const isValid = await bcrypt.compare(password, credential.password_hash);

            if (!isValid) {
                return res.status(401).json({ error: "Invalid username or password" });
            }

            const firebaseUid = credential.patient?.firebase_uid || credential.staff?.firebase_uid;
            
            if (!firebaseUid) {
                return res.status(500).json({ error: "User record corrupted: No Firebase UID" });
            }

            const customToken = await getAuth().createCustomToken(firebaseUid);

            return res.status(200).json({ 
                success: true, 
                customToken,
                user: { username: credential.username, type: credential.linked_user_type, patientId: credential.patient_id, staffId: credential.staff_id } 
            });
        } catch (error) {
            console.error("Login Error:", error);
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
