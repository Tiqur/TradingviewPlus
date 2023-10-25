import Hotkey from "../../utils/Hotkey";
import StorageService from "./StorageService";

export default class HotkeyService {
  storageService!: StorageService;
  hotkeys: Map<string, Hotkey> = new Map();

  constructor(h: Hotkey, s: StorageService) {
    this.setStorageService(s);
  }

  setStorageService(s: StorageService) {
    this.storageService = s;
  }

  setKeybind(key: string, h: Hotkey) {
    // Use storage service to update local storage
  }

  getKeybind() {

  }
}
