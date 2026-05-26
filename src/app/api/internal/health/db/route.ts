import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db/health";
import { requireStaff } from "@/lib/auth/guards";

export async function GET() {
  try {
    // Protect endpoint: require staff (or admin later)
    await requireStaff();

    const health = await checkDatabaseHealth();
    
    return NextResponse.json(health, { 
      status: health.healthy ? 200 : 503 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
