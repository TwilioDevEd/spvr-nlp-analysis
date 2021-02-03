/* eslint-disable func-names */
import SyncClient from 'twilio-sync';

class TwilioSyncClient {
  constructor() {
    this.syncClient = undefined;
  }

  getToken = async () => {
    try {
      const response = await fetch(process.env.TWILIO_SYNC_TOKEN_URL);
      const data = await response.json();
      return data.token;
    } catch (err) {
      console.log('Error retrieving Sync token. Refresh  browser.', err);
    }
  };

  setEvents = async (handleItemsAdded) => {
    try {
      let token = await this.getToken();
      this.syncClient = new SyncClient(token);

      const map = await this.syncClient.map(process.env.TWILIO_SYNC_MAP_NAME);

      map.on('itemAdded', async (args) => {
        handleItemsAdded({
          key: args.item.key,
          title: args.item.key,
          url: args.item.descriptor.data.url,
        });
      });

      this.syncClient.on('tokenAboutToExpire', async () => {
        token = await this.getToken();
        this.syncClient.updateToken(token);
      });
    } catch (err) {
      console.log('Token error. Reload page.', err);
    }
  };

  // Get all map items
  getMapItems = async () => {
    try {
      const mapItems = [];
      const pageHandler = function (paginator) {
        paginator.items.forEach((item) => {
          mapItems.push({ title: item.key, url: item.value.url });
        });
        return paginator.hasNextPage
          ? paginator.nextPage().then(pageHandler)
          : null;
      };
      const map = await this.syncClient.map(process.env.TWILIO_SYNC_MAP_NAME);
      await map.getItems().then(pageHandler);

      return mapItems;
    } catch (err) {
      console.log('Error retrieving Maps.', err);
    }
  };
}

export default TwilioSyncClient;
