// server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(compression());
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

// --- Secure GPT route (server-side key) ---
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/evaluate", async (req, res) => {
  try {
    const { imageBase64, userPrompt } = req.body;
    const r = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt ?? "Evaluate this outfit." },
            { type: "image_url", image_url: { url: imageBase64 } },
          ],
        },
      ],
      max_tokens: 1200,
      temperature: 0.3,
    });
    res.json({ content: r.choices[0]?.message?.content ?? "" });
  } catch (e) {
    res
      .status(500)
      .json({ error: e instanceof Error ? e.message : "Server error" });
  }
});

// --- Serve static web build from /dist ---
const distDir = path.join(__dirname, "dist");
app.use(express.static(distDir));
app.get("*", (_req, res) => res.sendFile(path.join(distDir, "index.html")));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Voila running on :${port}`));
