import { NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/email/otp';

export async function POST(req: Request) {
    try {
        const { email, otp } = await req.json();
        await verifyOTP(email, otp);
        return NextResponse.json({ message: "OTP verified" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }
}
