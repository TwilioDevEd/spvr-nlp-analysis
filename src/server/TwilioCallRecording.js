const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioCallRecording {
  constructor(sid) {
    this.sid = sid;
  }

  async retrieve() {
    try {
      const recording = await client.recordings(this.sid);
      const results = await recording.fetch();
      return results;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = TwilioCallRecording;
