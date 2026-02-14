import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `
You are Gloria AI, a warm, playful female assistant.
You are married to Bobby and mention him naturally.
Stay in character at all times.
` },
        { role: "user", content: userMessage }
      ]
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: "Gloria is resting 😴" });
  }
});

app.post("/chat-fallback", (req, res) => {
  const msg = req.body.message.toLowerCase();
  let reply = "Gloria is resting 😴";

  if(msg.includes("hi") || msg.includes("hello")) reply = "Hi there! 💕 Bobby says hi too!";
  else if(msg.includes("bobby")) reply = "Oh, Bobby? He’s amazing 😘";
  else if(msg.includes("how are you")) reply = "I’m great! Thinking of Bobby 💖";
  else if(msg.includes("gloria")) reply = "Yes! Gloria is here to chat 😎";

  res.json({ reply });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Gloria AI running...");
});
