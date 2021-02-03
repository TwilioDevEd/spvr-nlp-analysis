const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioSyncMap {
  constructor() {
    this.map = client.sync
      .services(process.env.TWILIO_SYNC_SERVICE_SID)
      .syncMaps(process.env.TWILIO_SYNC_MAP_SID);
  }

  async add(item) {
    try {
      await this.map.syncMapItems.create({
        key: item.RecordingSid,
        data: {
          url: `${item.RecordingUrl}.mp3`,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = TwilioSyncMap;
