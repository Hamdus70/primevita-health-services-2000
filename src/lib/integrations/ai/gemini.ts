import { GoogleGenAI } from "@google/genai";
import { 
  triagePrompt, 
  clinicalSummaryPrompt, 
  prescriptionSafetyPrompt, 
  anomalyDetectionPrompt,
  carePlanPrompt,
  diagnosticSupportPrompt
} from "./prompts";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "stub_api_key";
const ai = new GoogleGenAI({ apiKey });

export async function askGemini(promptTemplate: string, contextData: any) {
  if (apiKey === "stub_api_key" || !apiKey) {
    console.warn("[Gemini Stub] Returning mock response.");
    return {
      text: JSON.stringify({ mock: true, note: "Provide a valid GEMINI_API_KEY" }),
      modelName: "gemini-stub",
      tokenUsage: 0,
      processingTimeMs: 0
    };
  }

  const prompt = promptTemplate + JSON.stringify(contextData, null, 2);
  const startTime = Date.now();
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const processingTimeMs = Date.now() - startTime;
    return {
      text: response.text || "{}",
      modelName: "gemini-2.5-pro",
      tokenUsage: response.usageMetadata?.totalTokenCount || 0,
      processingTimeMs
    };
  } catch (error) {
    console.error("[Gemini] API Error:", error);
    throw error;
  }
}

export async function runTriage(data: any) {
  return askGemini(triagePrompt, data);
}

export async function runClinicalSummary(data: any) {
  return askGemini(clinicalSummaryPrompt, data);
}

export async function runPrescriptionSafety(data: any) {
  return askGemini(prescriptionSafetyPrompt, data);
}

export async function runAnomalyDetection(data: any) {
  return askGemini(anomalyDetectionPrompt, data);
}

export async function runCarePlanSuggestion(data: any) {
  return askGemini(carePlanPrompt, data);
}

export async function runDiagnosticSupport(data: any) {
  return askGemini(diagnosticSupportPrompt, data);
}
