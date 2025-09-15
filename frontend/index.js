// public/index.js (atau root index.js di Vercel)
const convertBtn = document.getElementById("convertBtn");
const inputUrl = document.getElementById("inputUrl");
const statusText = document.getElementById("statusText") || (document.getElementById("status") || { innerText: "" });
const resultWrap = document.getElementById("resultWrap") || (document.getElementById("result") || { innerHTML: "" });

// GANTI ke Railway backend-mu (pakai https://)
const API_BASE = "https://melfimp3-converter-youtube-to-mp3-production.up.railway.app";

function extractVideoId(url) {
  try {
    url = url.trim();
    if (!url) return null;
    // contoh formats: https://youtu.be/ID, https://www.youtube.com/watch?v=ID, /embed/ID, /v/ID
    if (url.includes("youtu.be/")) return url.split("youtu.be/")[1].split(/[?&]/)[0];
    if (url.includes("watch?v=")) return url.split("v=")[1].split("&")[0];
    if (url.includes("/embed/")) return url.split("/embed/")[1].split(/[?&]/)[0];
    if (url.includes("/v/")) return url.split("/v/")[1].split(/[?&]/)[0];
    // fallback: last path segment
    const parts = url.split("/");
    return parts[parts.length - 1].split(/[?&]/)[0];
  } catch {
    return null;
  }
}

convertBtn.addEventListener("click", async () => {
  const url = inputUrl.value || "";
  const videoId = extractVideoId(url);

  if (!videoId) {
    statusText.innerText = "Masukkan URL YouTube yang valid!";
    return;
  }

  statusText.innerText = "Memproses... Mohon tunggu.";
  resultWrap.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}/convert?id=${encodeURIComponent(videoId)}`);
    const data = await res.json();

    if (!res.ok) {
      console.error("Backend returned error:", data);
      statusText.innerText = data.message || data.error || "Gagal convert. Cek console.";
      return;
    }

    console.log("Backend response:", data);
    if (data.status === "ok" && data.link) {
      statusText.innerText = "Selesai! Klik link di bawah untuk download.";
      resultWrap.innerHTML = `<p>${data.title || "Hasil Convert"}</p><a href="${data.link}" target="_blank" rel="noopener">⬇️ Download MP3</a>`;
    } else {
      statusText.innerText = "Gagal convert: respons tidak mengandung link.";
      console.log("Raw API response:", data.raw || data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    statusText.innerText = "Terjadi error koneksi ke backend.";
  }
});
