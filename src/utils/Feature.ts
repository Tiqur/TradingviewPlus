enum Category { 'TV', 'TVP' };

abstract class Feature {
  private name: string;
  private tooltip: string;
  private enabled: boolean;
  private hotkey: Hotkey;
  private category: Category;
  private storageService: StorageService;

  constructor(name: string, tooltip: string, enabled: boolean, hotkey: Hotkey, category: Category, storageService: StorageService) {
    this.name = name;
    this.tooltip = tooltip;
    this.enabled = enabled;
    this.hotkey = hotkey;
    this.category = category;
    this.storageService = storageService;
    this.init();
  }

  public abstract init(): void;
  public abstract onKeyDown(e: KeyboardEvent): void;
  public abstract onKeyUp(e: KeyboardEvent): void;
  public abstract onMouseMove(e: MouseEvent): void;
  public abstract onMouseDown(e: MouseEvent): void;
  public abstract onMouseWheel(e: WheelEvent): void;

  public getCategory(): Category {
    return this.category;
  }

  public getName(): string {
    return this.name;
  }

  public setHotkey(newHotkey: Hotkey): boolean {
    // Check for conflicts
      features.forEach(f => {
        if (f.hotkey === newHotkey) {
          // Return false if conflicts
          return false;
        }
      })

    // Set new hotkey
    this.hotkey = newHotkey;

    // Set to local storage
    this.saveToLocalStorage();
    //console.log(this.getJson())
    //this.storageService.printStorage();

    // Return true if successfully set
    return true;
  }

  public getHotkey(): Hotkey {
    return this.hotkey;
  }

  public toggleEnabled() {
    this.enabled = !this.enabled;
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    // Set to local storage
    this.storageService.setValue(this.name, this.getJson());
  }

  public checkTrigger(e: KeyboardEvent): boolean {
    return (this.hotkey.key == null || this.hotkey.key?.toLowerCase() == e.key.toLowerCase())
      && this.hotkey.alt == e.altKey
      && this.hotkey.ctrl == e.ctrlKey
      && this.hotkey.meta == e.metaKey
      && this.hotkey.shift == e.shiftKey;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getJson() {
    return JSON.stringify({
      name: this.name,
      tooltip: this.tooltip,
      enabled: this.enabled,
      hotkey: this.hotkey,
      category: this.category,
    });
  }
}
