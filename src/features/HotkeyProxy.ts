import Keybind from "../utils/Keybind";

export default class KeybindProxy {
  keybind!: Keybind;

  // What the keybind proxy should call when fired
  proxyHotkey!: Hotkey;

  constructor(keybind: Keybind, proxyHotkey: Hotkey) {
    this.setKeybind(keybind);
    this.proxyHotkey = proxyHotkey;
  }

  setKeybind(keybind: Keybind) {
    this.keybind = keybind;
  }

  getKeybind() {
    return this.keybind;
  }

  fire() {
    // Call proxyHotkey ( emit necessary events )
  }
}
