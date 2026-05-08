const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        if (!videoURL) return res.status(400).send('URL missing');

        // Sabse important step: Agent aur Cookies (Agar block se bachna hai)
        const agent = ytdl.createAgent(); 

        const info = await ytdl.getInfo(videoURL, { agent });
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || "video";

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // Stream shuru
        ytdl(videoURL, {
            agent,
            format: 'mp4',
            quality: 'highest',
            filter: 'audioandvideo'
        }).pipe(res);

    } catch (err) {
        console.error("Error details:", err.message);
        res.status(500).send('YouTube block kar raha hai. Render free server par ye aksar hota hai.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live: ${PORT}`));

