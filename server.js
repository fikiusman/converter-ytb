// server.js
import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY; // simpan di Railway Variables

// Endpoint convert
app.get("/convert", async (req, res) => {
  const videoId = req.query.id;
  if (!videoId) {
    return res.status(400).json({ status: "error", message: "Video ID tidak ditemukan" });
  }

  try {
    const response = await fetch(
      `https://youtube-mp4-mp3-downloader.p.rapidapi.com/api/v1/ytmp3/${videoId}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube-mp4-mp3-downloader.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Error backend:", err);
    res.status(500).json({ status: "error", message: "Gagal fetch API" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
