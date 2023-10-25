enum Category { 'TV', 'TVP' };

abstract class Feature {
  private name: string;
  private tooltip: string;
  private enabled: boolean;
  private hotkey: Hotkey;
  private category: Category;

  constructor(name: string, tooltip: string, enabled: boolean, hotkey: Hotkey, category: Category, storageService: StorageService) {
    this.name = name;
    this.tooltip = tooltip;
    this.enabled = enabled;
    this.hotkey = hotkey;
    this.category = category;
    //this.storageService = storageService;
    this.init();
  }

  getCategory(): Category {
    return this.category;
  }

  getName(): string {
    return this.name;
  }

  setHotkey(newHotkey: Hotkey) {
    // Check for conflicts
    // ...
    this.hotkey = newHotkey;
    // ...
    // Set to local storage
  }

  getHotkey() {
    return this.hotkey;
  }

  checkTrigger(e: KeyboardEvent): boolean {
    return this.hotkey.key?.toLowerCase() == e.key.toLowerCase()
      && this.hotkey.alt == e.altKey
      && this.hotkey.ctrl == e.ctrlKey
      && this.hotkey.meta == e.metaKey
      && this.hotkey.shift == e.shiftKey;
  }

  abstract init(): void;

  isEnabled() {
    return this.enabled;
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
