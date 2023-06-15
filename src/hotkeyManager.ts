type Feature = {
  name: string;
  hotkey: string[];
  callback: Function;
}


class HotkeyManager {
  hotkeyMap: Map<string, Feature> = new Map();

  constructor(features?: Feature[]) {
    features?.map(e => this.hotkeyMap.set(e.name, e));
  }

  addHotkey(name: string, hotkey: string[], cb: Function) {
    this.hotkeyMap.set(name, {hotkey: hotkey, callback: cb} as Feature);
  }

  updateHotkey(key: string, newKey: string[]) {
    const feature = this.hotkeyMap.get(key);

    if (feature) {
      feature.hotkey = newKey;
    } else
      throw new Error("Feature doesn't exist");
  }

  initEvents() {
    document.addEventListener('keydown', e => {
    });
    document.addEventListener('scroll', e => {
    });
    document.addEventListener('click', e => {
    });
  }
}
