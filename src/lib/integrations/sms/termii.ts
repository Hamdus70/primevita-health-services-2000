export const TERMII_API_KEY = process.env.TERMII_API_KEY || "";
export const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || "NovaCare";
export const TERMII_BASE_URL = "https://api.ng.termii.com";

export async function sendTermiiSms(to: string, sms: string) {
  if (!TERMII_API_KEY) {
    console.warn("[Termii Stub] To:", to, "Message:", sms);
    return;
  }

  try {
    const response = await fetch(`${TERMII_BASE_URL}/api/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,
        from: TERMII_SENDER_ID,
        sms,
        type: "plain",
        channel: "generic",
        api_key: TERMII_API_KEY,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Termii] Failed to send SMS:", errorText);
      throw new Error("Failed to send SMS via Termii");
    }

    return await response.json();
  } catch (error) {
    console.error("[Termii] Exception:", error);
    throw error;
  }
}
