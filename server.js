import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// API Key dari environment variable
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

app.use(express.static("public")); // kalau file index.html, style.css, index.js ada di folder public

app.get("/convert", async (req, res) => {
  const { id, format } = req.query; // contoh: /convert?id=aJOTlE1K90k&format=mp3

  try {
    const response = await fetch(
      `https://youtube-mp3-converter.p.rapidapi.com/service/run?lang=en&id=${id}&action=button&widget=rapidapi&format=${format}`,
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
  console.log(`Server running on port ${PORT}`);
});
