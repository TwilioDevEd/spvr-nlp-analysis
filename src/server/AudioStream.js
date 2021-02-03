const fs = require('fs');
const https = require('https');

function getAudio(url) {
  return new Promise((resolve, reject) => {
    const filename = url.substring(url.lastIndexOf('/') + 1, url.length);
    const filePath = `./src/server/recordings/${filename}`;
    const audio = fs.createWriteStream(filePath);

    https.get(url, (res) => {
      this.stream = res.pipe(audio);

      this.stream.on('finish', () => {
        resolve(filePath);
      });

      this.stream.on('error', (err) => {
        reject(err);
      });
    });
  });
}

class AudioStream {
  constructor(url = null) {
    this.url = url;
    this.path = null;
  }

  async retrieve() {
    if (!this.url) {
      throw new Error('Invalid URL in AudioStream');
    }

    const file = await getAudio(this.url);
    this.path = file;

    return this.path;
  }
}

module.exports = AudioStream;
