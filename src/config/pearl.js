const apiKey = "";

// Make sure Node version >= 18
// Install dependency:
// npm install @google/generative-ai

import {
  HarmCategory,
  HarmBlockThreshold,
  GoogleGenerativeAI,
} from "@google/generative-ai";

// Update model name to Gemini 2.5 pro
const MODEL_NAME = "gemini-2.5-pro";

// Put your API key here (or use process.env.GOOGLE_API_KEY for security)
const API_KEY = "AIzaSyBUcxvTlLhRTp9-OLj1hTTKikULN4Nnbxw";

async function runChat(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
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

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  console.log(response.text());
  return response.text();
}

// Example usage:
runChat("what is react js");

export default runChat;