class FeatureClass {
  private name: string;
  private tooltip: string;
  private enabled: boolean;
  private hotkey: Hotkey | null;
  private category: string;

  constructor(f: Feature) {
    this.name = f.name;
    this.tooltip = f.tooltip;
    this.enabled = f.enabled;
    this.hotkey = f.hotkey;
    this.category = f.category;
    this.init();
  }

  getCategory() {
    return this.category;
  }

  getName() {
    return this.name;
  }

  getHotkey() {
    return this.hotkey;
  }

  checkTrigger(e: KeyboardEvent) {
    return this.hotkey?.key?.toLowerCase() == e.key.toLowerCase()
        && this.hotkey?.alt == e.altKey
        && this.hotkey?.ctrl == e.ctrlKey
        && this.hotkey?.meta == e.metaKey
        && this.hotkey?.shift == e.shiftKey;
  }

  // Actual code goes
  init() {
  }

  isEnabled() {
    return this.enabled;
  }

  setHotkey(h: Hotkey) {
    this.hotkey = h;
    this.saveToLocalStorage();
  }

  disable() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
  }

  // Gets json representation of feature
  getJson() {
    return {
      name: this.name,
      tooltip: this.tooltip,
      enabled: this.enabled,
      hotkey: this.hotkey,
      category: this.category,
    } as Feature;
  }

  saveToLocalStorage() {
    //this.getJson();
  }
}
