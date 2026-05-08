const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

// CORS allow karta hai taaki aapka frontend backend se baat kar sake
app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!videoURL) {
            return res.status(400).send('URL dena zaroori hai!');
        }

        // Video ki info nikalna (Title etc.)
        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, ""); // Special characters hatane ke liye

        // Browser ko batana ki file download karni hai
        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // Video stream karna
        ytdl(videoURL, {
            format: 'mp4',
            quality: 'highestvideo'
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error: Link invalid ho sakta hai ya server busy hai.');
    }
});

// Render ya kisi bhi host ke liye port setting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chalu hai port: ${PORT}`);
});
