import { resend, EMAIL_FROM } from "./resend";
import { getGenericNotificationTemplate, getAuthOtpTemplate, getTempPasswordTemplate } from "./templates";

export async function sendEmailAlert(to: string, subject: string, htmlBody: string) {
  // If not configured, just log
  if (!process.env.RESEND_API_KEY) {
    console.warn("[Email Stub] To:", to, "Subject:", subject);
    return;
  }

  try {
    const data = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html: htmlBody,
    });
    return data;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export async function sendNotificationEmail(to: string, title: string, message: string) {
  return sendEmailAlert(to, title, getGenericNotificationTemplate(title, message));
}

export async function sendOtpEmail(to: string, otp: string) {
  return sendEmailAlert(to, "Your NovaCare OTP", getAuthOtpTemplate(otp));
}

export async function sendTempPasswordEmail(to: string, password: string) {
  return sendEmailAlert(to, "Your NovaCare Temporary Password", getTempPasswordTemplate(password));
}
