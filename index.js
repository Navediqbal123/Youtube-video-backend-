const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core'); // Sirf ye line badli hai
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!videoURL) {
            return res.status(400).send('URL dena zaroori hai!');
        }

        const info = await ytdl.getInfo(videoURL);
        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, ""); 

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        // Nayi library ke mutabik filter update kiya hai
        ytdl(videoURL, {
            filter: 'audioandvideo',
            quality: 'highestvideo'
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).send('Error: Link invalid ho sakta hai ya server busy hai.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chalu hai port: ${PORT}`);
});
