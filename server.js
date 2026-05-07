const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url, quality } = req.body;

  try {
    const response = await fetch(
      `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoUrl=${encodeURIComponent(url)}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'youtube-media-downloader.p.rapidapi.com',
          'x-rapidapi-key': 'f3ca2a2633mshd2dc3580e93393bp1edeedjsnea3964232839'
        }
      }
    );

    const data = await response.json();
    console.log('Response:', JSON.stringify(data).substring(0, 300));

    const videos = data?.videos?.items;
    if (videos && videos.length > 0) {
      res.json({ success: true, downloadUrl: videos[0].url });
    } else {
      res.json({ success: false, error: JSON.stringify(data).substring(0, 200) });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
