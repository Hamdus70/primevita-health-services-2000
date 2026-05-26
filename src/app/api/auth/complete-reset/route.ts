import { NextResponse } from "next/server";
import { completePasswordReset } from "@/lib/auth/password-reset";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    const result = await completePasswordReset(token, newPassword);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
