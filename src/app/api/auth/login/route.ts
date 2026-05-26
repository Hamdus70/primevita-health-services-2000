import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: "Missing username or password" }, { status: 400 });
        }

        const credential = await prisma.userCredential.findUnique({
            where: { username: username }
        });

        if (!credential) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, credential.password_hash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
        }

        // Generate a session or token here (simplified)
        return NextResponse.json({ 
            success: true, 
            user: { username: credential.username, type: credential.linked_user_type, patientId: credential.patient_id, staffId: credential.staff_id } 
        });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
