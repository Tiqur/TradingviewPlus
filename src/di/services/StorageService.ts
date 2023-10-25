class StorageService {
  key!: string;
  storage: Map<string, any> = new Map();

  constructor(key: string) {
    this.key = key;

    (async () => {

      const storageObj: Record<string, any> = await this.fetchStorage();

      // Use locally stored data if available
      if (!this.storageIsEmpty(storageObj)) {
        this.storage = new Map(Object.entries(JSON.parse(storageObj[key])));
        await this.updateBrowserStorage(this.storage);
      }
    })
  }

  private async updateBrowserStorage(storage: Map<string, any>) {
    await browser.storage.local.set({"tvp-local-config": JSON.stringify(Object.fromEntries(storage))})
  }

  private async fetchStorage(): Promise<object> {
    return await browser.storage.local.get(this.key);
  }

  private storageIsEmpty(storageObj: object) {
    return Object.keys(storageObj).length === 0;
  }

  public async setValue(key: string, value: any) {
    this.storage.set(key, value);
    this.updateBrowserStorage(this.storage);
  }

  public getValue(key: string): any {
    return this.storage.get(key);
  }

  public async printStorage() {
    console.log(this.storage, await this.fetchStorage());
  }
}
