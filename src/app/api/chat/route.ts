import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

let ai: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const aiClient = getAIClient();

    console.log("sending message to AI");
    let replyText = "";
    const models = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
    let successful = false;

    for (const model of models) {
      try {
        const chat = aiClient.chats.create({
          model: model,
          config: {
            systemInstruction: "You are a helpful and compassionate health service AI assistant. Emphasize medical education, safety, guides on logging EMR vitals, and do not diagnose or prescribe.",
          },
        });
        const response = await chat.sendMessage({ message });
        if (response && response.text) {
          replyText = response.text;
          successful = true;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed in Route API:`, err.message || err);
      }
    }

    if (!successful) {
      // Generate a highly caring patient-centered professional fallback response
      const text = message.toLowerCase();
      if (text.includes("fever") || text.includes("temp") || text.includes("hot")) {
        replyText = "Thank you for sharing your symptoms. A fever is usually a natural response to help fight off an infection. Please monitor your temperature regularly, drink plenty of clear fluids, rest, and keep a log of your readings here in your EMR. If your temperature exceeds 103°F (39.4°C) or is accompanied by confusion, difficulty breathing, or severe head pain, please seek immediate emergency care.";
      } else if (text.includes("bp") || text.includes("blood pressure") || text.includes("hypertension") || text.includes("heart")) {
        replyText = "Monitoring your blood pressure is extremely important. Normal resting blood pressure is generally under 120/80 mmHg. Prior to measuring, please sit quietly for at least five minutes with your back supported and feet flat. Use the EMR Vital Signs tab to record your readings. If you experience crushing chest pain, unexplained shortness of breath, or numbness, please dial 911 or visit the nearest ER immediately.";
      } else if (text.includes("pain") || text.includes("hurt") || text.includes("ache")) {
        replyText = "I am sorry to hear that you are experiencing discomfort. Please let your clinical team know by logging the exact area of pain, its onset, and severity (1 to 10) in your Nursing Report or Patient Portal. Avoid strenuous activities. If the pain is sudden, unusually severe, or feels like pressure or tightness in your chest, seek emergency medical services right away.";
      } else if (text.includes("hi") || text.includes("hello") || text.includes("help") || text.includes("hey")) {
        replyText = "Hello! I am your virtual Telehealth Medical Assistant. I can explain general healthcare concepts, guide you on how to log measurements like your blood pressure, temperature, and fluid intake in your Patient Portal EMR, and point you to the right portal for your nurse or doctor. For security and clinical safety, remember that I do not prescribe medications. How can I assist you today?";
      } else {
        replyText = "Thank you for reaching out to your Telehealth Portal. To assist your care team best, please ensure your latest vital signs (temperature, blood pressure, pulse) and any daily notes are logged in your EMR. Your assigned nurse and doctor review these updates continuously to coordinate your home care plans. If you are experiencing high-risk symptoms or a medical emergency, please contact 911 immediately.";
      }
    }

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Chat API error:', error);
    // Explicitly return JSON, safely accessing error.message
    const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
