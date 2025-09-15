import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// API Key dari Railway → Variables
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

app.use(express.static("public")); // folder "public" berisi index.html, style.css, index.js

// 🔑 Endpoint API
app.get("/api/convert", async (req, res) => {
  const { id, format } = req.query; // contoh: /api/convert?id=aJOTlE1K90k&format=mp3

  if (!id) {
    return res.status(400).json({ error: "Video ID tidak ditemukan" });
  }

  try {
    const response = await fetch(
      `https://youtube-mp3-converter.p.rapidapi.com/service/run?lang=en&id=${id}&action=button&widget=rapidapi&format=${format || "mp3"}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "youtube-mp3-converter.p.rapidapi.com",
          "x-rapidapi-key": RAPIDAPI_KEY,
        },
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi error saat convert" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
