import { sendTermiiSms } from "./termii";

export async function sendSmsNotification(to: string, message: string) {
  // Strip out any non-numeric characters for valid E.164 without plus if needed by Termii
  const cleanPhone = to.replace(/\\D/g, "");
  return sendTermiiSms(cleanPhone, message);
}
