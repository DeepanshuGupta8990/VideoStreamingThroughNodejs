const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Define the path to your video files
// const videoPath = path.join(__dirname, 'video1.mp4');

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/video1', (req, res) => {
  res.sendFile(videoPath)
})
let a = 1
app.get('/video', (req, res) => {
  console.log(a++)
  const range = req.headers.range;
  const videoPath = path.join(__dirname, 'video1.mp4');
  const videoSize = fs.statSync(videoPath).size
  const chunkSize = 1 * 1e6;
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  }
  res.writeHead(206, headers)
  const stream = fs.createReadStream(videoPath, {
    start,
    end
  })
  stream.pipe(res)
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
