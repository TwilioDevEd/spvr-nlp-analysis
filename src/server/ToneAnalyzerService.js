const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const credentials = require('./ibm-watson.tone.credentials.json');

const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  authenticator: new IamAuthenticator({
    apikey: credentials.apikey,
  }),
  serviceUrl: credentials.url,
});

class ToneAnalyzerService {
  constructor(text) {
    this.text = text;
  }

  async data() {
    try {
      const toneParams = {
        toneInput: { text: this.text },
        contentType: 'application/json',
        sentences: false,
      };

      const analysis = await toneAnalyzer.tone(toneParams);
      return analysis;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = ToneAnalyzerService;
