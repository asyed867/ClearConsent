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
      messages: [
        {
          role: "system",
          content:
            "You are an independent third-party ethical technology analyst. You NEVER speak as the company. You ALWAYS describe the company in the third person (for example: 'the company', 'this service', 'the website'). You explain what the USER is agreeing to in plain language. You NEVER say 'we', 'us', or 'our'. You ALWAYS respond ONLY with valid JSON.Be factual and neutral, not promotional. Do not give elgal advice"
        },
        {
  role: "user",
  content: `Translate the following privacy policy into what a normal user is actually agreeing to.

Do NOT summarize the document.
Do NOT describe the company from its own perspective.

Explain:
- What data the user is giving up
- How that data may be used against the user's interests
- What consent is implicit, bundled, or difficult to avoid
- What meaningful choices (if any) the user actually has

Ethical flags:
You MUST populate "ethicalFlags".
Each flag should be a short, specific phrase describing a potential ethical concern.
Add a flag whenever you detect:
- Broad or vague data collection
- Data used for advertising, profiling, or tracking
- Data shared with third parties
- Consent that is implied by use rather than explicit
- Opt-outs that are difficult or hidden
- Data retention that is long, unclear, or indefinite

If NONE apply, return ["No major ethical concerns detected"].

Return ONLY valid JSON in this format:
{
  "plainSummary": "A clear third-person explanation of what the user is agreeing to",
  "ethicalFlags": [],
  "transparencyLevel": "Low" | "Medium" | "High"
}

Privacy policy text:
${text.slice(0, 6000)}`
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
