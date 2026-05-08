const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const app = express();

app.use(cors());

app.get('/download', async (req, res) => {
    try {
        const videoURL = req.query.url;
        
        if (!videoURL) {
            return res.status(400).send('URL dena zaroori hai!');
        }

        // Backend ko batana ki ye browser se request aa rahi hai (blocking se bachne ke liye)
        const info = await ytdl.getInfo(videoURL, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });

        const title = info.videoDetails.title.replace(/[^\x00-\x7F]/g, "") || "video"; 

        res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);

        ytdl(videoURL, {
            filter: 'audioandvideo',
            quality: 'highest',
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        }).pipe(res);

    } catch (err) {
        console.error("Download Error:", err.message);
        res.status(500).send('Error: YouTube block kar raha hai ya link galat hai.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server chalu hai port: ${PORT}`);
});
