import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(express.static(".")); // biar index.html & index.js bisa diakses

app.get("/api/convert", async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) {
    return res.status(400).json({ error: "Video ID diperlukan" });
  }

  try {
    const apiRes = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
          "x-rapidapi-key": "f96b9e6ba0mshdda6ccf6b9794e0p1f90e5jsn6ef74c7af6b1"
        }
      }
    );

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal menghubungi API RapidAPI" });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
