import { NextResponse } from "next/server";
import { verifyResetOtp } from "@/lib/auth/password-reset";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  try {
    const { token, code } = await req.json();

    if (!token) {
        return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const rateLimitResult = await checkRateLimit(`ratelimit:otp:${token}`, 10, 3600);
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: "Too many OTP verification attempts. Please try again later." }, { status: 429 });
    }

    const result = await verifyResetOtp(token, code);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

