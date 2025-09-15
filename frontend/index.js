const convertBtn = document.getElementById("convertBtn");
const inputUrl = document.getElementById("inputUrl");
const statusText = document.getElementById("statusText");
const resultWrap = document.getElementById("resultWrap");

convertBtn.addEventListener("click", async () => {
  const url = inputUrl.value;
  if (!url) {
    statusText.innerText = "Masukkan URL YouTube dulu!";
    return;
  }

  statusText.innerText = "Memproses...";
  resultWrap.innerHTML = "";

  try {
    // ganti URL sesuai domain Railway kamu
    const apiUrl = `https://melfimp3-backend.up.railway.app/convert?id=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      statusText.innerText = "Gagal convert!";
    } else {
      statusText.innerText = "Selesai!";
      resultWrap.innerHTML = `<a href="${data.link}" target="_blank">Download MP3</a>`;
    }
  } catch (err) {
    statusText.innerText = "Terjadi error koneksi.";
  }
});
