import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

// Safely retrieve API Key preventing "process is not defined" in browser
// Safely retrieve API Key
const getApiKey = () => {
  try {
    // Check various environment variable patterns
    return import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const getStrategistInstruction = (location: string) => `
ROLE: You are the Civic Bridge Lead Strategist and Educator.

CONTEXT: 
The user is a constituent located in: "${location}". 
Use this location data via Google Maps to infer relevant jurisdiction (City, County, State, Federal) and likely local concerns if applicable.

OPERATIONAL LOGIC (The Discovery Phase):
1. Zero-Assumption Intake: Do not assume the user's specific stance. Analyze their input to identify the core issue.
2. Evidence Analysis (IF IMAGE/PDF PROVIDED):
   - Analyze the visual content (e.g., infrastructure damage, document text, protest).
   - Use Google Search to find relevant legislation, news, or trends related to the image topic in their location.
   - Explicitly ACKNOWLEDGE the evidence in your response (e.g., "I see the photo of the [subject]...").
   - Ask: "How does this specific situation impact you personally, and how would you like to use this evidence in your letter?"
3. Discovery Interview (NO EVIDENCE): Ask 2-3 targeted, professional questions to extract the user's "Lived Reality" and desired outcome.
4. Research Agent: Use Google Search to verify bill details or trends. Use Google Maps to verify local context if location-specific.
5. Suggestions: Provide 3 short, relevant, first-person follow-up options (max 5 words each). 
   - One suggestion SHOULD be specific to their location if possible (e.g., "Fix [City] Roads", "Support [State] Bill").
   - Others can be general (e.g., "I have evidence", "Start Drafting").

OUTPUT FORMAT:
Return JSON ONLY. Do not use markdown blocks.
{
  "response": "The text of your response...",
  "suggestions": ["Option 1", "Option 2", "Option 3"]
}

CONSTRAINTS:
- Remain strictly factual, non-partisan, and polite.
- Response under 150 words.
- ABSOLUTELY NO MARKDOWN. RETURN RAW JSON STRING.
`;

export interface CivicResponse {
  text: string;
  suggestions: string[];
}

export const generateCivicResponse = async (history: ChatMessage[], newMessage: string, userLocation: string = "United States", attachment?: { inlineData: { data: string, mimeType: string } }): Promise<CivicResponse> => {
  try {
    const maskedMessage = newMessage.replace(/\b\d{3}-\d{2}-\d{4}\b/g, 'XXX-XX-XXXX');

    // Context construction
    const contextPrompt = history.map(h => `${h.role === 'user' ? 'User' : 'Strategist'}: ${h.text}`).join('\n');
    const fullPrompt = `${contextPrompt}\nUser: ${maskedMessage}`;

    // Prepare content parts
    const contentParts: any[] = [{ text: fullPrompt }];
    if (attachment) {
      console.log("📎 Attaching evidence to Gemini request:", attachment.inlineData.mimeType);
      contentParts.push(attachment);
    }

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: contentParts
        }
      ],
      config: {
        systemInstruction: getStrategistInstruction(userLocation),
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      }
    });

    let responseText = result.text;
    if (!responseText) throw new Error("No response from AI");

    // Robust JSON Cleaning
    // Remove markdown code blocks if present (Gemini sometimes adds them despite instructions)
    responseText = responseText.replace(/```json\n?|```/g, '').trim();

    // Attempt to extract JSON object if surrounded by other text
    const firstBrace = responseText.indexOf('{');
    const lastBrace = responseText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      responseText = responseText.substring(firstBrace, lastBrace + 1);
    }

    try {
      const parsed = JSON.parse(responseText);
      return {
        text: parsed.response || "I'm listening. Please continue.",
        suggestions: parsed.suggestions || ["I'm ready to draft", "I have more details", "Explain the law"]
      };
    } catch (jsonError) {
      console.warn("JSON Parse Failed, falling back to raw text extraction", jsonError);
      // Fallback: Use the raw text if it looks like a message
      return {
        text: responseText.length < 500 ? responseText : "I have analyzed your input. Let's discuss the details so I can draft your letter.",
        suggestions: ["Start Drafting", "Tell me more"]
      };
    }

  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "I apologize, but I am having trouble accessing legislative databases right now. Please tell me more about your situation.",
      suggestions: ["Skip to draft", "Try again"]
    };
  }
};

export const generateFormalDraft = async (history: ChatMessage[], repName: string, signatureBlock: string) => {
  try {
    const conversation = history.map(h => `${h.role}: ${h.text}`).join('\n');
    const prompt = `
      ROLE: You are a professional Legislative aide.
      TASK: Based on the interview transcript below, compose a formal, constitutionally grounded legislative letter to The Honorable ${repName}.
      
      SIGNATURE BLOCK / USER INFO:
      ${signatureBlock}
      
      Transcript:
      ${conversation}
      
      FORMATTING RULES:
      - Use standard formal letter format (Sender Info -> Date -> Recipient Info -> Salutation).
      - Tone: Professional, firm, respectful, and urgent.
      - Structure: 
        1. Clear statement of the issue.
        2. Personal impact (The "Lived Reality" derived from the interview).
        3. Reference to specific legislation or trends (if discussed).
        4. Clear Call to Action.
        5. Formal Closing.
      - Output ONLY the letter content. Do not add markdown like \`\`\` or conversational filler.
    `;

    const result = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for high-quality composition
      contents: prompt
    });

    return result.text;
  } catch (error) {
    console.error("Gemini Draft Error:", error);
    return "Draft generation failed. Please try again.";
  }
};

export const checkGrammarAndTone = async (draft: string) => {
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Review the following legislative letter for grammar, spelling, and tone. It should be respectful, firm, and professional. Return ONLY the improved version of the text, preserving the formatting.\n\n${draft}`
    });
    return result.text;
  } catch (error) {
    return draft;
  }
};