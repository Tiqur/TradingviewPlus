import Hotkey from "../../utils/Hotkey";
import StorageService from "./StorageService";

export default class HotkeyService {
  currentHotkey!: Hotkey;
  storageService!: StorageService;

  constructor(h: Hotkey, s: StorageService) {
    this.setKeybind(h);
    this.setStorageService(s);
  }

  setStorageService(s: StorageService) {
    this.storageService = s;
  }

  setKeybind(h: Hotkey) {
    this.currentHotkey = h;
    // Use storage service to update local storage
  }

  getKeybind() {

  }
}
