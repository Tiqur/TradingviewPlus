class StorageService {
  key!: string;
  storage: Map<string, any> = new Map();

  constructor(key: string) {
    this.key = key;

    (async () => {

      const storageObj: Record<string, any> = await this.fetchStorage();

      // Use locally stored data if available
      if (!this.storageIsEmpty(storageObj)) {
       this.setStorage(new Map(Object.entries(JSON.parse(storageObj[key]))));
      }
    })
  }

  setStorage(newConfig: Map<string, any>) {

  }

  async fetchStorage(): Promise<object> {
    return await browser.storage.local.get(this.key);
  }

  storageIsEmpty(storageObj: object) {
    return Object.keys(storageObj).length === 0;
  }

}
