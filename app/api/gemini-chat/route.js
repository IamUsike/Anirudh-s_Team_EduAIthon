// app/api/gemini-chat/route.js
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Backend received body:", JSON.stringify(body, null, 2));
    const { message, history } = body;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      // model: "gemini-1.5-flash-latest",
      model: "gemini-2.0-flash",
      safetySettings, 
      // generationConfig: { 
      //   maxOutputTokens: 2048, 
        temperature: 0.1,    
      // }
    });

    const formattedHistory = (history || []).map(h => ({
        role: h.role,
        parts: Array.isArray(h.parts) ? h.parts.map(p => (typeof p.text === 'string' ? { text: p.text } : { text: String(p) })) : [{ text: String(h.parts) }]
    })).filter(h => h.parts.every(p => typeof p.text === 'string'));

    console.log("Formatted history for Gemini:", JSON.stringify(formattedHistory, null, 2));

    const chat = model.startChat({
      history: formattedHistory,
    });

    console.log(`Sending message to Gemini: "${message}"`);
    const result = await chat.sendMessage(message);
    const response = result.response;

    // Check if the response was blocked due to safety settings
    if (response.promptFeedback && response.promptFeedback.blockReason) {
        console.warn("Gemini response blocked:", response.promptFeedback);
        return NextResponse.json(
          { error: `Response blocked due to: ${response.promptFeedback.blockReason}`, details: response.promptFeedback },
          { status: 400 } 
        );
    }

    const text = response.text();
    console.log("Gemini reply:", text);
    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error("Gemini API error in backend:", error);
    let errorMessage = "Failed to process request with Gemini API.";
    let errorDetails = {};
    let statusCode = 500;

    if (error.message) {
      errorMessage = error.message;
    }
    if (error.httpError) {
        errorMessage = error.httpError.message || errorMessage;
        statusCode = error.httpError.status || statusCode;
        errorDetails.httpStatus = error.httpError.status;
        errorDetails.httpMessage = error.httpError.message;
    } else if (error.toString) {
        errorDetails.rawError = error.toString();
    }

    return NextResponse.json(
      {
        error: `Gemini API Backend Error: ${errorMessage}`,
        details: errorDetails,
      },
      { status: statusCode }
    );
  }
}
