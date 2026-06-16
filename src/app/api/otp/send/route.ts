import { NextResponse } from 'next/server';
import { sendOTP } from '@/lib/email/otp';

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        await sendOTP(email);
        return NextResponse.json({ message: "OTP sent" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
    }
}
