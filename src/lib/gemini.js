import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { useToast } from "@/components/ui/use-toast";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
 model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.4,
  topP: 0.95,
  topK: 32,
  maxOutputTokens: 800,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function queryGemini(prompt, medications) {
  try {
    let content = prompt;
    
    if (medications && medications.length > 0) {
      content = `
I need information about the following medications I'm taking:
${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}, taken ${med.schedule}`).join('\n')}

My question is: ${prompt}
      `;
    }

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chatSession.sendMessage(content);
    const text = result.response.text();
    return { text };

  } catch (error) {
    console.error("Error querying Gemini:", error);
    return { 
      text: "",
      error: "Failed to connect to AI service. Please try again later."
    };
  }
}

export async function generateAdherenceInsights(medications, takenCount, missedCount) {
  const adherenceRate = medications.length > 0 
    ? Math.round((takenCount / (takenCount + missedCount)) * 100) || 0
    : 0;
  
  const prompt = `
I'm using a medication tracking app called PillPal. Based on my current medication data:
- Total active medications: ${medications.length}
- Doses taken: ${takenCount}
- Doses missed: ${missedCount}
- Current adherence rate: ${adherenceRate}%

${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}, taken ${med.schedule}`).join('\n')}

Please analyze this data and provide 2-3 brief, personalized insights to help me improve my medication adherence. 
Keep your response under 150 words and focus on practical advice.
  `;
  
  return queryGemini(prompt);
}

export async function generateInteractionWarnings(medications) {
  if (medications.length < 2) {
    return { text: "No potential interactions to analyze with only one medication." };
  }
  
  const prompt = `
I'm taking the following medications:
${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}`).join('\n')}

Are there any common or serious interactions between these medications that I should be aware of? 
Focus only on significant interactions and keep your response under 150 words. 
If there are no significant known interactions, please state that briefly.
  `;
  
  return queryGemini(prompt);
}

export async function generateDosageOptimizations(medications) {
  const prompt = `
I'm taking the following medications with these schedules:
${medications.map(med => `- ${med.name} (${med.dosage}) for ${med.category}, currently taken ${med.schedule}${med.time ? ` at ${med.time}` : ''}`).join('\n')}

Based on general medication best practices, can you provide brief suggestions for optimizing when I take these medications during the day?
Focus on practical advice about timing related to meals, sleep, or other medications.
Keep your response under 150 words and make it easily scannable.
  `;
  
  return queryGemini(prompt);
}