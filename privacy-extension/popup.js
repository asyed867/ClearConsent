document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;

    document.getElementById("result").style.display = "none";
    document.getElementById("analyzeBtn").textContent = "Analyzing...";

    const response = await fetch("http://localhost:3001/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();
    const analysis = data.analysis;

    document.getElementById("summary").textContent =
      analysis.plainSummary || "No summary available.";

    const flagsList = document.getElementById("flags");
    flagsList.innerHTML = "";

    if (analysis.ethicalFlags && analysis.ethicalFlags.length > 0) {
      analysis.ethicalFlags.forEach(flag => {
        const li = document.createElement("li");
        li.textContent = flag;
        flagsList.appendChild(li);
      });
    } else {
      flagsList.innerHTML = "<li>No major ethical concerns found.</li>";
    }

    document.getElementById("transparency").textContent =
      analysis.transparencyLevel || "Unknown";

    document.getElementById("result").style.display = "block";
    document.getElementById("analyzeBtn").textContent = "Analyze This Site";
  });
});
