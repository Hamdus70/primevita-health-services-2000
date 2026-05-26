import { PrismaClient } from '@prisma/client';
import { sendEmail } from './smtp';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Prevent multiple connections in dev
if (process.env.NODE_ENV !== 'production') {
  (global as any).prisma = prisma;
}

export async function sendOTP(email: string) {
    // 1. Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // 2. Save OTP in db with 10 mins expiry
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.otpCode.create({
        data: {
            email,
            code: otp,
            expires_at: expiresAt
        }
    });
    
    // 3. Send email
    const subject = "Your Verification Code";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Your Security Code</h2>
            <p>Please use the following 6-digit code to verify your identity.</p>
            <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f0f0f0; display: inline-block; border-radius: 5px;">
                ${otp}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                This code will expire in 10 minutes. Do not share this code with anyone.
            </p>
        </div>
    `;

    return await sendEmail(email, subject, htmlContent);
}

export async function verifyOTP(email: string, otp: string) {
    // Check database for recent OTPs matching the email and code
    const validOtp = await prisma.otpCode.findFirst({
        where: {
            email,
            code: otp,
            expires_at: {
                gt: new Date() // Must not be expired
            }
        },
        orderBy: {
            created_at: 'desc'
        }
    });

    if (!validOtp) {
        throw new Error("Invalid or expired OTP");
    }

    // Optional: Delete the OTP so it can't be reused
    await prisma.otpCode.delete({ where: { id: validOtp.id } });

    return { success: true, message: "OTP verified successfully" };
}
