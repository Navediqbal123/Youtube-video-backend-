const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/download', async (req, res) => {
  const { url } = req.body;

  try {
    const response = await fetch(
      `https://api.vevioz.com/api/button/mp4/${encodeURIComponent(url)}`
    );
    const data = await response.json();
    console.log('Response:', JSON.stringify(data).substring(0, 300));

    if (data.url) {
      res.json({ success: true, downloadUrl: data.url });
    } else {
      res.json({ success: false, error: JSON.stringify(data).substring(0, 200) });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
