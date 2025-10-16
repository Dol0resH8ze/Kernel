document.addEventListener("DOMContentLoaded", () => {
  const runBtn = document.getElementById("runBtn");
  if (!runBtn) {
    console.error("script.js: #runBtn not found in DOM. Check f1.html for the correct id and that the script is loaded after the element.");
    return;
  }

  const loading = document.getElementById("loading");
  const plotImg = document.getElementById("plot");
  const status = document.getElementById("status");

  runBtn.addEventListener("click", async () => {
    const gp = document.getElementById("raceSelect")?.value;
    if (!gp) {
      alert("Please select a Grand Prix first!");
      return;
    }
    const roundNum = parseInt(gp, 10);

    // UI reset
    if (status) { status.classList.add("hidden"); status.textContent = ""; }
    if (loading) loading.classList.remove("hidden");
    if (plotImg) { plotImg.classList.add("hidden"); plotImg.src = ""; }

    try {
      const response = await fetch("/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ round: roundNum })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const err = data.error || "Server returned an error";
        if (status) { status.textContent = err; status.classList.remove("hidden"); }
        console.error("Server error:", err);
        return;
      }

      if (!data.plot) {
        if (status) { status.textContent = "No plot returned from server"; status.classList.remove("hidden"); }
        return;
      }

      if (plotImg) {
        plotImg.src = "data:image/png;base64," + data.plot;
        plotImg.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (status) { status.textContent = "Network error: " + (error.message || error); status.classList.remove("hidden"); }
    } finally {
      if (loading) loading.classList.add("hidden");
    }
  });
});
