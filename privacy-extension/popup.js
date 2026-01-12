document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;
    const output = document.getElementById("output");

    output.textContent = "Analyzing...";

    try {
      const response = await fetch("http://localhost:3001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      // 🔑 SHOW EXACTLY WHAT WE GOT
      const analysis = data.analysis;

    if (!analysis) {
      output.textContent = "No summary available.";
      return;
    }

    output.innerHTML = `
      <h3>What you’re agreeing to</h3>
      <p>${analysis.plainSummary}</p>

      <h3>Ethical flags</h3>
      <ul>
        ${analysis.ethicalFlags.map(flag => `<li>${flag}</li>`).join("")}
      </ul>

      <h3>Transparency level</h3>
      <p><strong>${analysis.transparencyLevel}</strong></p>
    `;


    } catch (err) {
      output.textContent = "Error: " + err.message;
    }
  });
});
