# Clear Consent 🔍

Clear Consent is a Chrome extension that helps users understand what they are actually agreeing to when they accept a website’s privacy policy.

Instead of summarizing legal text, the tool analyzes a privacy policy from a live webpage URL and explains user consent in plain language. It highlights ethical concerns such as data collection, tracking, and implied consent, and provides a transparency rating.

---

## Features

- Analyzes real privacy policies directly from a webpage URL  
- Translates legal language into clear, user-focused explanations  
- Identifies ethical concerns related to data use and consent  
- Provides a transparency level (Low / Medium / High)  
- Simple Chrome extension interface  

---

## Tech Stack

- **Frontend:** JavaScript, HTML, CSS, Chrome Extension APIs  
- **Backend:** Node.js, Express, Axios, Cheerio  
- **AI:** OpenAI API (LLM-based analysis)

---

## How It Works

1. The user opens a webpage and clicks the extension.
2. The extension sends the current URL to a Node.js server.
3. The server extracts relevant policy text and sends it to an LLM.
4. The LLM returns a structured explanation of user consent and ethical concerns.
5. The results are displayed in the extension.

---

## Disclaimer

This tool does not provide legal advice. It is intended for educational and ethical analysis purposes only.

---

## Author

Built as a learning and portfolio project exploring ethical technology, privacy, and responsible AI use.
