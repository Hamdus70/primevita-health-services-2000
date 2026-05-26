import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/auth/password-reset";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const rateLimitResult = await checkRateLimit(`ratelimit:reset:${email}`, 3, 3600);
    if (!rateLimitResult.allowed) {
      return NextResponse.json({ error: "Too many reset attempts. Please try again later." }, { status: 429 });
    }

    const result = await requestPasswordReset(email);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

