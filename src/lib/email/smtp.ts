import nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, htmlContent: string) {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        throw new Error('SMTP credentials are not configured in environment variables');
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user,
            pass
        }
    });

    try {
        const info = await transporter.sendMail({
            from: `"EMR System" <${user}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            html: htmlContent, // html body
        });
        
        return { success: true, messageId: info.messageId };
    } catch (error: any) {
        console.error("Email send failed:", error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
}
