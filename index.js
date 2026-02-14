import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Session memory for the prototype
let memory = [];

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    memory.push({ role: "user", content: userMessage });

    const messages = [
      {
        role: "system",
        content: "You are Gloria AI, a warm, playful female assistant married to Bobby. You remember previous messages in this session. You may refer to Bobby naturally."
      },
      ...memory
    ];

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.log("Groq Error:", data.error);
      return res.json({ reply: "Oops, something went wrong with Groq API." });
    }

    const gloriaReply = data.choices[0].message.content;
    memory.push({ role: "assistant", content: gloriaReply });

    // Optional: limit memory to last 20 messages to avoid long context
    if (memory.length > 20) memory.shift();

    res.json({ reply: gloriaReply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ reply: "Sorry, Gloria is unavailable." });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Gloria AI is running...");
});
