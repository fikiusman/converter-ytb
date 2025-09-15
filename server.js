import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

// API Key dari Railway Variables
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

app.use(express.static("public"));

// Endpoint convert
app.get("/convert", async (req, res) => {
  const { id } = req.query; // ?id=VIDEO_ID

  if (!id) {
    return res.status(400).json({ error: "ID video tidak ditemukan" });
  }

  try {
    const response = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${id}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
      }
    );

    const data = await response.json();
    console.log("Response dari RapidAPI:", data);

    if (!data || data.status !== "ok") {
      return res.status(400).json({ error: "Gagal convert", detail: data });
    }

    res.json(data);
  } catch (err) {
    console.error("Error di server:", err);
    res.status(500).json({ error: "Terjadi error saat convert" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
