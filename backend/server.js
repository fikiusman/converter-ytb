const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Aktifkan CORS (aman: hanya izinkan domain Vercel kamu)
app.use(cors({
  origin: "https://melfi-sable.vercel.app", // ganti sesuai domain Vercel kamu
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Endpoint convert
app.get("/convert", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "Missing video id" });
    }

    // 🔑 Panggil API RapidAPI
    const response = await axios.get("https://youtube-mp4-mp3-downloader.p.rapidapi.com/api/v1/progress", {
      params: { id },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "youtube-mp4-mp3-downloader.p.rapidapi.com"
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error("Error in /convert:", err.message);
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
