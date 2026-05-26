import { NextResponse } from 'next/server';
import { StaffService } from '@/services/staff/staff.service';
import { sendEmail } from '@/services/emailService';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Map to what StaffService.createStaffApplication expects (StaffApplicationRequest)
        const staffData = {
          first_name: body.firstName,
          middle_name: "",
          last_name: body.lastName,
          email: body.email,
          phone: body.phone || "0000000000",
          date_of_birth: new Date().toISOString(),
          licence_number: body.licenceNumber || "N/A",
          role: body.role.toUpperCase(),
          guarantor_name: body.guarantorName || "N/A",
          guarantor_phone: body.guarantorPhone || "0000000000"
        };

        const newStaff = await StaffService.createStaffApplication(staffData as any);

        await sendEmail({
            to: 'primevitahealthservices@gmail.com',
            subject: 'New Staff Application',
            text: `New staff application submitted: ${staffData.first_name} ${staffData.last_name}`,
            html: `<p>New staff application submitted: <strong>${staffData.first_name} ${staffData.last_name}</strong>. Role: ${staffData.role}</p>`
        });

        return NextResponse.json({
            message: "Staff application submitted successfully.",
            staff: newStaff
        }, { status: 201 });

    } catch (error: any) {
        console.error("Staff Application Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
