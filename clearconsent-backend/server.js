require("dotenv").config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");

const app = express();
const PORT = 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// ==========================
// TEST / ANALYZE ENDPOINT
// ==========================
app.post("/analyze", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "No URL provided" });
  }

  try {
    // 1. Fetch webpage
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(response.data);

    // Remove junk
    $("script, style, nav, footer, header").remove();

    const text = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    // 2. Send to LLM
    const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content:
        "You explain privacy policies in plain language. Always respond ONLY with valid JSON."
    },
    {
      role: "user",
      content: `
Analyze the following webpage text.

If this is NOT a privacy policy, return:
{
  "plainSummary": "This page does not appear to be a privacy policy.",
  "ethicalFlags": [],
  "transparencyLevel": "Unknown"
}

If it IS a privacy policy, return:
{
  "plainSummary": string,
  "ethicalFlags": string[],
  "transparencyLevel": "Low" | "Medium" | "High"
}

Text:
${text.slice(0, 6000)}
      `
    }
  ]
});


    // 3. Parse response
    let analysis;
    try {
      analysis = JSON.parse(completion.choices[0].message.content);
    } catch {
      analysis = {
        error: "Invalid JSON from LLM",
        raw: completion.choices[0].message.content
      };
    }

    res.json({
      success: true,
      analysis
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Failed to analyze privacy policy"
    });
  }
});

// ==========================
// START SERVER (IMPORTANT)
// ==========================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
