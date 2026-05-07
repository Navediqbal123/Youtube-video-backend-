const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(
      `https://y2mate-youtube-video-and-mp3-downloader.p.rapidapi.com/rapidapi-y2mate/?url=${encodeURIComponent(url)}&proxy=0`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'y2mate-youtube-video-and-mp3-downloader.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        }
      }
    );

    const data = await response.json();
    console.log('Response:', JSON.stringify(data).substring(0, 300));

    if (data.mp4) {
      res.json({ success: true, downloadUrl: data.mp4 });
    } else {
      res.json({ success: false, error: JSON.stringify(data).substring(0, 200) });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
