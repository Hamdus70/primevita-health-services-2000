import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text, html }: { to: string, subject: string, text: string, html: string }) {
    try {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.error("Missing SMTP configuration in environment variables");
            return;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for port 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            text,
            html,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
