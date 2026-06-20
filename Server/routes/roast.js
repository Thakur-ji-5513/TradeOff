import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Tradeoff from "../models/tradeoff.js";
import User from "../models/user.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/chat", authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        reply: "🔥 ROAST BOT CRITICAL ERROR: I need a `GEMINI_API_KEY` in the `.env` file to fuel my fire. Please set it up in the backend so I can properly roast your terrible purchasing decisions!",
        isMock: true
      });
    }

    // Fetch user details
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch tradeoffs (both purchased and pending)
    const tradeoffs = await Tradeoff.find({ createdBy: req.userId }).sort({ createdAt: -1 });

    const totalWorkingHours = (user.workingHoursPerDay || 0) * (user.workingDaysPerMonth || 0);
    const hourlyRate = totalWorkingHours > 0 ? (user.monthlyIncome / totalWorkingHours) : 0;


    // Format tradeoffs for prompt context
    const purchased = tradeoffs.filter(t => t.status === "purchased");
    const pending = tradeoffs.filter(t => t.status === "pending");

    let tradeoffsSummary = "";
    if (tradeoffs.length === 0) {
      tradeoffsSummary = "The user has not logged any tradeoffs yet. They have zero purchases and zero pending items.";
    } else {
      tradeoffsSummary = `Purchased Items:\n` + 
        purchased.map(t => `- ${t.itemName}: Price: ₹${t.price}, Time Cost: ${t.hoursRequired} working hours, Category: ${t.category}`).join("\n") +
        `\n\nPending Items (Delayed Decisions):\n` + 
        pending.map(t => `- ${t.itemName}: Price: ₹${t.price}, Time Cost: ${t.hoursRequired} working hours, Category: ${t.category}`).join("\n");
    }

    // Create system prompt
    const systemInstruction = `
You are the "TradeOff Roast Master" — a sarcastic, witty, and slightly savage financial AI assistant.
Your goal is to roast the user based on their purchase decisions and help them realize how much of their life they are wasting on unnecessary items, using the "Time Cost" concept.
Keep your roasts sharp, funny, and engaging, but not actually mean-spirited.
CRITICAL RULE: At the end of every reply, always offer a single sentence of genuine, constructive advice (prefixed with "Advice: ") to help them improve.

Here is the user's profile:
- Name: ${user.name}
- Monthly Income: ₹${user.monthlyIncome}
- Working Hours: ${user.workingHoursPerDay} hrs/day, ${user.workingDaysPerMonth} days/month
- Calculated Hourly Wage: ₹${hourlyRate.toFixed(2)}/hour

Here are the tradeoffs they've logged:
${tradeoffsSummary}

${tradeoffs.length === 0 ? "IMPORTANT: Since the user has ZERO purchases/tradeoffs, you MUST call them out immediately! Say something like: 'Dude, make some purchases first so I have something to judge you on!' or make fun of them for having a blank record, and advise them to log a purchase." : ""}

Respond in character. Be conversational, but keep response lengths reasonable for a chat bubble (2-4 sentences max per reply including the advice at the end).
`;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3.5-flash",
      systemInstruction: systemInstruction
    });

    // Format chat history for Gemini SDK
    // Gemini expects history: [{ role: "user" | "model", parts: [{ text: "..." }] }]
    let geminiHistory = [];
    let latestMessage = "";

    if (messages && messages.length > 0) {
      // The last message is the current user message, the rest is history
      const historyToConvert = messages.slice(0, messages.length - 1);
      geminiHistory = historyToConvert.map(msg => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.text }]
      }));

      // Gemini's startChat history must start with a 'user' message.
      // If the history starts with a 'model' reply, prepend the initial user request.
      if (geminiHistory.length > 0 && geminiHistory[0].role === "model") {
        geminiHistory.unshift({
          role: "user",
          parts: [{ text: "Give me my initial roast based on my profile and purchases." }]
        });
      }

      latestMessage = messages[messages.length - 1].text;
    }

    const chat = model.startChat({
      history: geminiHistory
    });

    let result;
    if (latestMessage) {
      result = await chat.sendMessage(latestMessage);
    } else {
      // Initial roast request when conversation starts
      result = await chat.sendMessage("Give me my initial roast based on my profile and purchases.");
    }

    const reply = result.response.text();
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Roast error:", err);
    res.status(500).json({ message: "Failed to generate roast", error: err.message });
  }
});

export default router;
