const convertBtn = document.getElementById("convertBtn");
const inputUrl = document.getElementById("inputUrl");
const statusText = document.getElementById("statusText");
const resultWrap = document.getElementById("resultWrap");
const progressWrap = document.getElementById("progressWrap");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// Backend Railway
const API_BASE = "https://melfimp3-converter-youtube-to-mp3-production.up.railway.app";

function extractVideoId(url) {
  try {
    url = url.trim();
    if (!url) return null;
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split(/[?&]/)[0];
    if (url.includes("watch?v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split(/[?&]/)[0];
    if (url.includes("/v/")) return url.split("/v/")[1].split(/[?&]/)[0];
    const parts = url.split("/");
    return parts[parts.length - 1].split(/[?&]/)[0];
  } catch {
    return null;
  }
}

function simulateProgress(callback) {
  progressWrap.classList.remove("hidden");
  progressText.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.innerText = "0%";

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5; // naik random biar natural
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      callback();
    }
    progressFill.style.width = progress + "%";
    progressText.innerText = progress + "%";
  }, 400);
}

convertBtn.addEventListener("click", async () => {
  const url = inputUrl.value || "";
  const videoId = extractVideoId(url);

  if (!videoId) {
    statusText.innerText = "Masukkan URL YouTube yang valid!";
    return;
  }

  statusText.innerText = "Sedang memproses...";
  resultWrap.innerHTML = "";

  simulateProgress(async () => {
    try {
      const res = await fetch(`${API_BASE}/convert?id=${encodeURIComponent(videoId)}`);
      const data = await res.json();

      if (!res.ok) {
        statusText.innerText = data.message || data.error || "Gagal convert.";
        return;
      }

      if (data.status === "ok" && data.link) {
        statusText.innerText = "✅ Selesai!";
        resultWrap.innerHTML = `
          <p id="songTitle">🎶 ${data.title || "Hasil Convert"}</p>
          <a id="downloadLink" href="${data.link}" target="_blank" rel="noopener">⬇️ Download MP3</a>
        `;
      } else {
        statusText.innerText = "Gagal convert: link tidak ditemukan.";
      }
    } catch (err) {
      console.error(err);
      statusText.innerText = "Terjadi error koneksi ke backend.";
    }
  });
});
