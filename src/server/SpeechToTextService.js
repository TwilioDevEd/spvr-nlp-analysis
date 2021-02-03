const fs = require('fs');
const EventEmitter = require('events');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const { IamAuthenticator } = require('ibm-watson/auth');

const credentials = require('./ibm-watson.transcription.credentials.json');

const speechToText = new SpeechToTextV1({
  authenticator: new IamAuthenticator({
    apikey: credentials.apikey,
  }),
  serviceUrl: credentials.url,
});

class SpeechToTextService extends EventEmitter {
  constructor(recording, keywords = ['Twilio', 'doctor', 'groceries', 'warranty']) {
    super();
    this.filepath = recording;
    this.recognizeStream = null;
    this.keywords = keywords;

    this.pipe();
    this.setEvents();
  }

  close() {
    if (this.recognizeStream) {
      this.recognizeStream.destroy();
    }
  }

  pipe() {
    this.recognizeStream = speechToText.recognizeUsingWebSocket({
      contentType: 'audio/mp3;rate=36000',
      objectMode: true,
      model: 'en-US_BroadbandModel',
      keywords: this.keywords,
      keywordsThreshold: 0.5,
      speakerLabels: true,
      maxAlternatives: 1,
    });

    fs.createReadStream(this.filepath).pipe(this.recognizeStream);
  }

  setEvents() {
    if (!this.recognizeStream) {
      throw new Error('recognizeStream not set in SpeechToTextService');
    }

    this.recognizeStream.on('error', (err) => {
      throw new Error(err);
    });

    this.recognizeStream.on('data', (data) => {
      data.results.forEach(async (result) => {
        if (result.final) {
          this.emit('finished', result);
        }
      });
    });
  }

  async data() {
    return new Promise((resolve) => {
      this.on('finished', resolve);
    });
  }
}

module.exports = SpeechToTextService;
