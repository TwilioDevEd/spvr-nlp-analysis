require('dotenv').config();

const express = require('express');
const client = require('twilio');

const { AccessToken } = client.jwt;
const { SyncGrant } = AccessToken;

const AudioStream = require('./AudioStream');
const SpeechToTextService = require('./SpeechToTextService');
const ToneAnalyzerService = require('./ToneAnalyzerService');
const TwilioSyncMap = require('./TwilioSyncMap');
const TwilioCallRecording = require('./TwilioCallRecording');

const app = express();

app.use(express.static('dist'));
app.use(express.json());

// IBM Watson Transcription Service
const getTranscript = async (url) => {
  const stream = new AudioStream(url);
  const recording = await stream.retrieve();
  const transcription = new SpeechToTextService(recording);
  const results = await transcription.data();
  return results;
};

// IBM Watson Tone Service
const getTone = async (text) => {
  const tone = new ToneAnalyzerService(text);
  const data = await tone.data();
  // Sometimes we don't get a tone back
  if (data.result.document_tone.tones.length === 0) {
    data.result.document_tone.tones.push({ tone_name: 'Unknown' });
  }
  return data;
};

// Endpoint used by UI to retrieve transcript and tone
app.get('/api/analysis', async (req, res) => {
  try {
    const url = req.query.url || '';
    const transcript = await getTranscript(url);
    const text = transcript.alternatives[0].transcript || '';
    const tone = await getTone(text);
    const documentTone = tone.result.document_tone;
    const results = { ...transcript, ...documentTone };
    res.send(results);
  } catch (err) {
    res.status(500).send({ msg: `${err}` });
  }
});

// Retrieve Recording Data
app.get('/api/recording', async (req, res) => {
  try {
    const sid = req.query.sid || '';
    const callRecording = new TwilioCallRecording(sid);
    const results = await callRecording.retrieve();
    res.send(results);
  } catch (err) {
    res.status(500).send({ msg: `${err}` });
  }
});

// Create Twilio Sync Token
app.get('/api/token', async (req, res) => {
  try {
    const identity = 'recordings';
    const syncGrant = new SyncGrant({
      serviceSid: process.env.TWILIO_SYNC_SERVICE_SID,
    });

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );

    token.addGrant(syncGrant);
    token.identity = identity;

    res.send({
      identity,
      token: token.toJwt(),
    });
  } catch (err) {
    res.status(500).send({ msg: 'Error retrieving Sync token.' });
  }
});

// Twilio Webhook for recordingCallback
app.use(express.urlencoded({ extended: true }));
app.post('/api/transcribe', async (req, res) => {
  try {
    const syncMap = new TwilioSyncMap();
    await syncMap.add(req.body);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send({ msg: `${err}` });
  }
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
