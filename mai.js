
import {
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAI,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-2.5-pro";
const API_KEY = "AIzaSyBUcxvTlLhRTp9-OLj1hTTKikULN4Nnbxw" || ""; // safer than hardcoding

if (!API_KEY) {
  throw new Error("❌ Missing API Key. Set GOOGLE_API_KEY in environment.");
}

async function runChat(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.7,   // balance creativity + accuracy
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096, // more detailed responses
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

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    // ✨ System prompt to guide model always to explain + code
    const systemInstruction = `
You are a programming tutor. 
For every prompt:
1. Explain the concept clearly with structured points.
2. Show common use-cases and advantages/disadvantages.
3. Display related data structures in a clear format.
4. Always provide clean and working code examples in JavaScript, Python, and Java (if relevant).
5. Format everything in markdown for readability.
`;

    const result = await chat.sendMessage(systemInstruction + "\n\nUser: " + prompt);
    const response = result.response;

    console.log("✅ AI Response:\n", response.text());
    return response.text();

  } catch (err) {
    console.error("❌ Error generating response:", err.message);
    return "Something went wrong. Please try again.";
  }
}

// Example usage: 
// Will explain + generate code automatically
runChat("Explain Stack data structure and show implementation in JavaScript, Python, and Java.");

export default runChat;
