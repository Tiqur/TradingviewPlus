class HotkeyMangager {
  constructor(hotkey: Hotkey) {

  }

  public listenForNewHotkey() {
    document.addEventListener("keydown", this.listenForKeydown);
  }


  private listenForKeydown(event: KeyboardEvent) {
    const { key } = event;

    switch (event.key) {
      case "Shift":
      case "Ctrl":
      case "Alt":
      case "Meta":
        break;
      default:
        console.log(key);
        document.removeEventListener("keydown", this.listenForKeydown);
        break;
    }

  }


  private isHotkeyMatch(hotkey1: Hotkey, hotkey2: Hotkey) {
    return (
      hotkey1.key === hotkey2.key &&
      hotkey1.ctrl === hotkey2.ctrl &&
      hotkey1.shift === hotkey2.shift &&
      hotkey1.alt === hotkey2.alt &&
      hotkey1.meta === hotkey2.meta
    );
  }

}
