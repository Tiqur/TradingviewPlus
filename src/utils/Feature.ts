enum Category { 'TV', 'TVP' };

abstract class Feature {
  name: string;
  tooltip: string;
  enabled: boolean;
  keybind: Keybind;
  category: Category;
  storageService!: StorageService;

  constructor(name: string, tooltip: string, enabled: boolean, keybind: Keybind, category: Category, storageService: StorageService) {
    this.name = name;
    this.tooltip = tooltip;
    this.enabled = enabled;
    this.keybind = keybind;
    this.category = category;
    this.storageService = storageService;
    this.init();
  }

  getCategory(): Category {
    return this.category;
  }

  getName(): string {
    return this.name;
  }

  getHotkey() {
  }

  checkTrigger(e: KeyboardEvent): boolean {
    const hk = this.keybind.getHotkey();

    return hk.key?.toLowerCase() == e.key.toLowerCase()
      && hk.alt == e.altKey
      && hk.ctrl == e.ctrlKey
      && hk.meta == e.metaKey
      && hk.shift == e.shiftKey;
  }

  abstract init(): void;

  isEnabled() {
    return this.enabled;
  }

  setHotkey(h: Hotkey) {
  }
  
  saveToLocalStorage() {

  }

  getJson() {
    return {
      name: this.name,
      tooltip: this.tooltip,
      enabled: this.enabled,
      keybind: this.keybind,
      category: this.category,
    };
  }

}
