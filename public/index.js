document.getElementById("convertBtn").addEventListener("click", async () => {
  const url = document.getElementById("youtubeUrl").value.trim();
  const videoId = extractVideoId(url);

  if (!videoId) {
    alert("URL YouTube tidak valid!");
    return;
  }

  // Progress bar tampil
  document.getElementById("progressContainer").classList.remove("hidden");
  updateProgress(0);

  let fakeProgress = 0;
  const interval = setInterval(() => {
    if (fakeProgress < 90) {
      fakeProgress += 5;
      updateProgress(fakeProgress);
    }
  }, 400);

  try {
    // ✅ panggil backend kamu
    const response = await fetch(`/convert?id=${videoId}`);
    const data = await response.json();

    clearInterval(interval);
    console.log("Response dari server:", data);

    if (data.status === "ok" && data.link) {
      updateProgress(100);

      setTimeout(() => {
        document.getElementById("songTitle").textContent = data.title || "Hasil Convert";
        document.getElementById("downloadLink").href = data.link;
        document.getElementById("result").classList.remove("hidden");
        document.getElementById("progressContainer").classList.add("hidden");
      }, 800);
    } else {
      alert("Gagal convert! Respon tidak valid.");
      document.getElementById("progressContainer").classList.add("hidden");
    }
  } catch (err) {
    clearInterval(interval);
    console.error("Error fetch:", err);
    alert("Terjadi error saat fetch.");
    document.getElementById("progressContainer").classList.add("hidden");
  }
});

function updateProgress(val) {
  document.getElementById("progressFill").style.width = val + "%";
  document.getElementById("progressText").textContent = val + "%";
}

function extractVideoId(url) {
  try {
    let videoId = null;

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("/embed/")) {
      videoId = url.split("/embed/")[1].split("?")[0];
    } else if (url.includes("/v/")) {
      videoId = url.split("/v/")[1].split("?")[0];
    }

    return videoId && videoId.length === 11 ? videoId : null;
  } catch {
    return null;
  }
}
