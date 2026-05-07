const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  try {
    const videoId = url.match(/(?:v=|\/shorts\/)([^&?/]+)/)?.[1];
    if (!videoId) {
      return res.json({ success: false, error: 'Invalid YouTube URL' });
    }

    const dlUrl = `https://www.y2mate.com/mates/analyzeV2/ajax`;
    const response = await fetch(dlUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `k_query=https://www.youtube.com/watch?v=${videoId}&k_page=home&hl=en&q_auto=0`
    });

    const data = await response.json();
    console.log('y2mate:', JSON.stringify(data).substring(0, 300));

    if (data.vid) {
      const mp4Url = `https://www.y2mate.com/mates/convertV2/index`;
      const res2 = await fetch(mp4Url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `vid=${data.vid}&k=${data.links?.mp4?.['720p']?.k}`
      });
      const data2 = await res2.json();
      if (data2.dlink) {
        return res.json({ success: true, downloadUrl: data2.dlink });
      }
    }
    res.json({ success: false, error: JSON.stringify(data).substring(0, 200) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
