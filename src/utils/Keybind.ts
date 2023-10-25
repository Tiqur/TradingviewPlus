class Keybind {
  hotkey!: Hotkey;

  constructor(h: Hotkey) {
    this.hotkey = h;
  }

  setHotkey(key: string, h: Hotkey, s: StorageService) {
    // Use storage service to update local storage
  }

  getHotkey(): Hotkey {
    return this.hotkey;
  }
}
