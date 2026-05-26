import { sendEmail } from './smtp';

export async function sendAdminNotification(subject: string, message: string) {
    const adminEmail = 'jimohmuhammad21@gmail.com';
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #0f172a; padding: 15px 20px;">
                    <h2 style="color: white; margin: 0;">Admin Notification</h2>
                </div>
                <div style="padding: 20px;">
                    <h3 style="color: #334155; margin-top: 0;">${subject}</h3>
                    <p style="color: #475569; font-size: 16px; line-height: 1.5; white-space: pre-wrap;">${message}</p>
                </div>
                <div style="background-color: #f1f5f9; padding: 15px 20px; text-align: center; color: #64748b; font-size: 12px;">
                    <p>This is an automated notification from your EMR System.</p>
                </div>
            </div>
        </div>
    `;

    return await sendEmail(adminEmail, subject, htmlContent);
}
