interface Feature {
  name: string;
  tooltip: string;
  enabled: boolean;
  hotkey: string[] | null;
  action: Function;
  category: 'Features' | 'Display' | 'Settings';
}



class HotkeyManager {
  hotkeyMap: Map<string, Feature> = new Map();

  constructor(features?: Feature[]) {
    features?.map(e => this.hotkeyMap.set(e.name, e));
  }

  addHotkey(name: string, tooltip: string, hotkey: string[], cb: Function) {
    this.hotkeyMap.set(name, {tooltip: tooltip, hotkey: hotkey, action: cb} as Feature);
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
