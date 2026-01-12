document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;

    const output = document.getElementById("output");
    output.textContent = "Analyzing...";

    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      const analysis = data.analysis;

      output.textContent = `
Summary:
${analysis.plainSummary}

Ethical Flags:
${analysis.ethicalFlags.length ? "- " + analysis.ethicalFlags.join("\n- ") : "None"}

Transparency Level:
${analysis.transparencyLevel}
      `;
    } catch {
      output.textContent = "Error analyzing page.";
    }
  });
});
