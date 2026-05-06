const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url, quality } = req.body;

  try {
    const response = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        url: url,
        videoQuality: quality || '720',
        filenameStyle: 'pretty'
      })
    });

    const data = await response.json();

    if (data.status === 'redirect' || data.status === 'stream') {
      res.json({ success: true, downloadUrl: data.url });
    } else if (data.status === 'picker') {
      res.json({ success: true, downloadUrl: data.picker[0].url });
    } else {
      res.json({ success: false, error: 'Download link nahi mila' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
