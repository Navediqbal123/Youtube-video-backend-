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
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        url: url,
        videoQuality: quality || '720',
        filenameStyle: 'pretty',
        downloadMode: 'auto'
      })
    });

    const text = await response.text();
    console.log('Raw Cobalt response:', text);

    const data = JSON.parse(text);

    if (data.url) {
      res.json({ success: true, downloadUrl: data.url });
    } else if (data.picker && data.picker.length > 0) {
      res.json({ success: true, downloadUrl: data.picker[0].url });
    } else if (data.status === 'error') {
      res.json({ success: false, error: data.error?.code || 'Cobalt error' });
    } else {
      res.json({ success: false, error: 'No URL: ' + text });
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
