import { sendEmail } from './smtp';

export async function sendInterviewInvite(email: string, date: Date, link: string) {
    const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    const subject = "Interview Invitation";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Interview Invitation</h2>
            <p>Congratulations, you have been selected for an interview.</p>
            
            <table style="width: 100%; max-width: 400px; margin: 20px 0; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Date & Time</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">${formattedDate}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold;">Location</td>
                    <td style="padding: 10px; border-bottom: 1px solid #ddd;">Virtual Session</td>
                </tr>
            </table>

            <p>Please use the secure link below to join the interview at the specified time:</p>
            <p>
                <a href="${link}" style="background-color: #0369a1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Join Interview Session
                </a>
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Instructions:
                <ul>
                    <li>Please join 5 minutes early.</li>
                    <li>Ensure you have a stable internet connection.</li>
                    <li>Test your microphone and video before joining.</li>
                </ul>
            </p>
        </div>
    `;

    return await sendEmail(email, subject, htmlContent);
}

export async function sendInterviewReminder(email: string, date: Date, link: string) {
    const formattedDate = date.toLocaleString('en-US', {
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });

    const subject = "Reminder: Upcoming Interview Tomorrow";
    const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Interview Reminder</h2>
            <p>This is a reminder for your upcoming interview tomorrow at ${formattedDate}.</p>
            
            <p>
                <a href="${link}" style="background-color: #0369a1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Join Interview Session
                </a>
            </p>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                We look forward to speaking with you!
            </p>
        </div>
    `;

    return await sendEmail(email, subject, htmlContent);
}
