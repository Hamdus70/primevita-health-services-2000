import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { primeVitaSystemPrompt } from '@/data/primevita_system_prompt';
import { phase1Constitution } from '@/data/knowledge_base/phase_1_constitution';
import { phase2Services } from '@/data/knowledge_base/phase_2_services';
import { phase3Portals } from '@/data/knowledge_base/phase_3_portals';
import { phase4Appointment } from '@/data/knowledge_base/phase_4_appointment';
import { phase5PatientJourney } from '@/data/knowledge_base/phase_5_patient_journey';
import { phase6ClinicalJourney } from '@/data/knowledge_base/phase_6_clinical_journey';
import { phase7Recruitment } from '@/data/knowledge_base/phase_7_recruitment';
import { phase8Billing } from '@/data/knowledge_base/phase_8_billing';
import { phase9Emr } from '@/data/knowledge_base/phase_9_emr';
import { phase10Medical } from '@/data/knowledge_base/phase_10_medical';
import { phase11CustomerService } from '@/data/knowledge_base/phase_11_customer_service';
import { phase12Voice } from '@/data/knowledge_base/phase_12_voice';
import { phase13Whatsapp } from '@/data/knowledge_base/phase_13_whatsapp';
import { phase14Admin } from '@/data/knowledge_base/phase_14_admin';
import { phase15Escalation } from '@/data/knowledge_base/phase_15_escalation';
import { phase16Conversation } from '@/data/knowledge_base/phase_16_conversation';
import { phase17Doctor } from '@/data/knowledge_base/phase_17_doctor';
import { phase18Nurse } from '@/data/knowledge_base/phase_18_nurse';
import { phase19Safety } from '@/data/knowledge_base/phase_19_safety';
import { phase20Conclusion } from '@/data/knowledge_base/phase_20_conclusion';

const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { message, knowledge = "" } = await req.json();

    let retries = 0;
    while (retries < 3) {
      try {
        const chat = aiClient.chats.create({
          model: 'gemini-1.5-pro',
          config: {
            systemInstruction: `${primeVitaSystemPrompt}\nCONSTITUTION: ${phase1Constitution}\nSERVICES: ${phase2Services}\nPORTALS: ${phase3Portals}\nAPPOINTMENT INTELLIGENCE: ${phase4Appointment}\nPATIENT JOURNEY: ${phase5PatientJourney}\nCLINICAL JOURNEY: ${phase6ClinicalJourney}\nRECRUITMENT INTELLIGENCE: ${phase7Recruitment}\nBILLING INTELLIGENCE: ${phase8Billing}\nEMR INTELLIGENCE: ${phase9Emr}\nMEDICAL INTELLIGENCE: ${phase10Medical}\nCUSTOMER SERVICE INTELLIGENCE: ${phase11CustomerService}\nVOICE AGENT INTELLIGENCE: ${phase12Voice}\nWHATSAPP AGENT INTELLIGENCE: ${phase13Whatsapp}\nADMINISTRATIVE INTELLIGENCE: ${phase14Admin}\nESCALATION PROTOCOLS: ${phase15Escalation}\nCONVERSATION LIBRARIES: ${phase16Conversation}\nDOCTOR COPILOT: ${phase17Doctor}\nNURSE COPILOT: ${phase18Nurse}\nCLINICAL SAFETY LAYER: ${phase19Safety}\nCONCLUSION V1.0: ${phase20Conclusion}\nAdditional Knowledge: ${knowledge}`,
          },
        });

        const response = await chat.sendMessage({ message });
        return NextResponse.json({ reply: response.text });
      } catch (error: any) {
        if (error.status === 429 && retries < 2) {
          retries++;
          await sleep(2000 * Math.pow(2, retries)); // Exponential backoff
          continue;
        }
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.status === 429 ? 'Rate limit exceeded, please try again later.' : 'Failed to process chat' },
      { status: error.status || 500 }
    );
  }
}
