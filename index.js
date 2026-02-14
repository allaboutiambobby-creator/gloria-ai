import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  try {
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
          messages: [
            {
              role: "system",
              content:
                "You are Gloria AI, a warm and playful female assistant married to Bobby."
            },
            {
              role: "user",
              content: req.body.message
            }
          ]
        })
      }
    );

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.json({ reply: "Gloria is resting 😴" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Gloria AI running...");
});
