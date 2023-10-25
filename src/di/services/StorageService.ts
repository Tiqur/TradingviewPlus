export default class StorageService {
  storage: Map<string, any> = new Map();

  constructor(key: string) {
    (async () => {

      const storageObj: Record<string, any> = await this.fetchStorage(key);

      // Use locally stored data if available
      if (!this.storageIsEmpty(storageObj)) {
       this.setStorage(new Map(Object.entries(JSON.parse(storageObj[key]))));
      }
    })
  }

  setStorage(newConfig: Map<string, any>) {

  }

  async fetchStorage(key: string): Promise<object> {
    return await browser.storage.local.get(key);
  }

  storageIsEmpty(storageObj: object) {
    return Object.keys(storageObj).length === 0;
  }

}
