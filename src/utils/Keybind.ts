class Keybind {
  hotkey!: Hotkey;

  constructor(h: Hotkey) {
  }

  setKeybind(key: string, h: Hotkey, s: StorageService): Hotkey {
    // Use storage service to update local storage
    return this.hotkey;
  }

  getKeybind() {

  }
}
