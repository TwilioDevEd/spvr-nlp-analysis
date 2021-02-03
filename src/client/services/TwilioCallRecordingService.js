export default class TwilioCallRecordingService {
  constructor(sid) {
    this.sid = sid;
  }

  async retrieve() {
    const response = await fetch(`/api/recording?sid=${this.sid}`);
    const results = await response.json();
    return results;
  }
}
