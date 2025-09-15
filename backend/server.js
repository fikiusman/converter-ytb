// server.js (Railway backend)
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Buka CORS supaya frontend (Vercel) bisa memanggil.
// Jika mau lebih aman, ganti origin: "*" -> "https://melfi-sable.vercel.app/"
app.use(cors({ origin: "*" }));

app.get("/convert", async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing video id" });

    // Panggil RapidAPI (youtube-mp36)
    const apiUrl = "https://youtube-mp36.p.rapidapi.com/dl";
    const response = await axios.get(apiUrl, {
      params: { id },
      headers: {
        "x-rapidapi-host": "youtube-mp36.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY, // HARUS diset di Railway variables
      },
      timeout: 30000,
    });

    const data = response.data;
    console.log("/convert -> RapidAPI response:", JSON.stringify(data).slice(0, 1000));

    // Normalisasi respons supaya frontend lebih mudah pakai
    // API berbeda-beda bentuk respons so we try to find likely fields
    const link = data.link || data.url || (data.result && data.result.link) || null;
    const title = data.title || (data.result && data.result.title) || null;

    if (link) {
      return res.json({ status: "ok", title: title || "Converted audio", link, raw: data });
    } else {
      // Jika RapidAPI tidak mengembalikan link, kirim raw sebagai detail
      return res.status(400).json({ status: "error", message: "No download link returned", raw: data });
    }
  } catch (err) {
    console.error("Error in /convert:", err && err.message ? err.message : err);
    const detail = (err.response && err.response.data) ? err.response.data : err.message || err;
    return res.status(500).json({ status: "error", message: "Server error", detail });
  }
});

app.get("/", (req, res) => res.send("Backend alive"));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
