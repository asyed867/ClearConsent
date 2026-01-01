document.getElementById("analyzeBtn").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const url = tabs[0].url;

    document.getElementById("output").textContent = "Analyzing...";

    const response = await fetch("http://localhost:3001/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    document.getElementById("output").textContent =
      JSON.stringify(data.analysis, null, 2);
  });
});
