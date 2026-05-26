import { PrismaClient } from '@prisma/client';
import { sendEmail } from './smtp';
import crypto from 'crypto';

const prisma = new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  (global as any).prisma = prisma;
}

export async function sendTrackingLink(email: string) {
    // 1. Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // 2. Save token in database
    await prisma.trackingToken.create({
        data: {
            email,
            token
        }
    });

    // 3. Build link
    const domain = process.env.APP_URL || 'http://localhost:3000';
    const trackingLink = `${domain}/application-track/${token}`;

    // 4. Send email
    const subject = "Track Your Application";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Application Tracking</h2>
            <p>Your application has been received. You can track its status using the secure link below.</p>
            <p>
                <a href="${trackingLink}" style="background-color: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Track Application
                </a>
            </p>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Link: ${trackingLink}<br/>
                If you did not request this, please ignore this email.
            </p>
        </div>
    `;

    return await sendEmail(email, subject, htmlContent);
}
