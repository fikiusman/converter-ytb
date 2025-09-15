const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

app.get("/convert", async (req, res) => {
  try {
    const { id } = req.query;
    // panggil API RapidAPI misalnya
    const response = await axios.get(`https://youtube-mp3-api-url?id=${id}`, {
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "youtube-mp3-api-url"
      }
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Server error", detail: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
