class TimeframeScroll extends Feature {
  private scrollTimeout: number | null = null;

  constructor() {
    super(
      'Scroll Timeframes',
      'Allows you to scroll through favourite timeframes',
      true,
      { key: null, ctrl: false, shift: false, alt: false, meta: false },
      Category.TVP,
      false,
      ['Alt', 'Shift', 'Scroll']
    );

    if (!this.getConfigValue('hotkey1'))
      this.setConfigValue('hotkey1', { key: 'WheelUp',   ctrl:false, shift:true, alt:true,  meta:false });    // “next”
    if (!this.getConfigValue('hotkey2'))
      this.setConfigValue('hotkey2', { key: 'WheelDown', ctrl:false, shift:true, alt:true,  meta:false });    // “previous”

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey 1', () => {
        const lbl = document.getElementById(`${this.getName()}-hotkey-label`); if (lbl) lbl.textContent = '...';
        captureHotkey((res) => {
          const rerender = () => (document.querySelector('[id="tvp-menu"] input') as HTMLInputElement | null)
            ?.dispatchEvent(new InputEvent('input'));
          if (res === 'cancel') { snackBar('Keybind assignment canceled'); rerender(); return; }
          if (res === 'clear')  { this.setConfigValue('hotkey1', { key: null, ctrl:false, shift:false, alt:false, meta:false }); this.saveToLocalStorage(); snackBar('Hotkey 1 cleared'); rerender(); return; }
          const dup = checkDuplicateHotkeys(features, res);
          if (!dup) { this.setConfigValue('hotkey1', res); this.saveToLocalStorage(); }
          else snackBar(dup.reason === 'modifier_only' ? 'Error: Modifier-only keybinds are not supported'
                        : dup.reason === 'unmappable'   ? 'Error: This key cannot be assigned'
                                                         : 'Error: Duplicate Keybind');
          rerender();
        });
      }),
      new ContextMenuListItem('Change Hotkey 2', () => {
        const lbl = document.getElementById(`${this.getName()}-hotkey-label`); if (lbl) lbl.textContent = '...';
        captureHotkey((res) => {
          const rerender = () => (document.querySelector('[id="tvp-menu"] input') as HTMLInputElement | null)
            ?.dispatchEvent(new InputEvent('input'));
          if (res === 'cancel') { snackBar('Keybind assignment canceled'); rerender(); return; }
          if (res === 'clear')  { this.setConfigValue('hotkey2', { key: null, ctrl:false, shift:false, alt:false, meta:false }); this.saveToLocalStorage(); snackBar('Hotkey 2 cleared'); rerender(); return; }
          const dup = checkDuplicateHotkeys(features, res);
          if (!dup) { this.setConfigValue('hotkey2', res); this.saveToLocalStorage(); }
          else snackBar(dup.reason === 'modifier_only' ? 'Error: Modifier-only keybinds are not supported'
                        : dup.reason === 'unmappable'   ? 'Error: This key cannot be assigned'
                                                         : 'Error: Duplicate Keybind');
          rerender();
        });
      }),
    ]);
  }

  // ===== event entry points =====
  onMouseWheel(e: WheelEvent) {
    // direction from wheel
    const dir = e.deltaY < 0 ? +1 : -1;
    // allow wheel-only path if mods match either bind
    if (this.matchesSubHotkey(e, 'hotkey1') && dir === +1) return this.queueStep(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2') && dir === -1) return this.queueStep(-1, e);
  }
  onMouseDown(e: MouseEvent) {
    // mouse buttons can trigger steps
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueStep(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueStep(-1, e);
  }
  onKeyDown(e: KeyboardEvent) {
    // keyboard keys can trigger steps
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueStep(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueStep(-1, e);
  }
  onKeyUp(_e: KeyboardEvent) {}
  onMouseMove(_e: MouseEvent) {}
  onMouseDownCapture?(_e: MouseEvent) {} // ignore if your base class doesn’t declare
  init() {}

  // ===== matching and action =====
  private matchesSubHotkey(ev: KeyboardEvent | MouseEvent | WheelEvent, which: 'hotkey1'|'hotkey2'): boolean {
    const hk = this.getConfigValue(which) as Hotkey | undefined;
    return this.matches(hk, ev);
  }

  private normalizeEventKey(ev: KeyboardEvent | MouseEvent | WheelEvent): string | null {
    if ('key' in ev) return ev.key; // keyboard
    if ('deltaY' in ev) return ev.deltaY < 0 ? 'WheelUp' : 'WheelDown'; // wheel
    if ('button' in ev) { // mouse buttons
      const b = ev.button;
      return b === 0 ? 'MouseLeft' : b === 1 ? 'MouseMiddle' : b === 2 ? 'MouseRight' : b === 3 ? 'Mouse4' : b === 4 ? 'Mouse5' : null;
    }
    return null;
  }

  private matches(hk: Hotkey | undefined, ev: KeyboardEvent | MouseEvent | WheelEvent): boolean {
    if (!hk || !hk.key) return false;
    const eventKey = this.normalizeEventKey(ev);
    if (!eventKey) return false;
    return hk.key.toLowerCase() === eventKey.toLowerCase()
        && !!hk.alt   === !!(ev as any).altKey
        && !!hk.ctrl  === !!(ev as any).ctrlKey
        && !!hk.meta  === !!(ev as any).metaKey
        && !!hk.shift === !!(ev as any).shiftKey;
  }

  private queueStep(direction: 1 | -1, e: Event) {
    // stop native behavior on wheel and button to avoid TV interference
    if (e.cancelable) { e.preventDefault(); e.stopPropagation(); }
    if (this.scrollTimeout) window.clearTimeout(this.scrollTimeout);
    this.scrollTimeout = window.setTimeout(() => { this.processStep(direction); this.scrollTimeout = null; }, 50);
  }

  private processStep(direction: 1 | -1) {
    const buttons = Array.from(document.querySelectorAll('#header-toolbar-intervals div[role="radiogroup"] button'));
    if (buttons.length === 0) return;
    const active = document.querySelector('#header-toolbar-intervals div[role="radiogroup"] button.isActive-GwQQdU8S') as HTMLElement | null;
    if (!active) return;

    const idx = buttons.indexOf(active);
    if (idx === -1) return;

    const next = idx + direction;
    if (next >= 0 && next < buttons.length) (buttons[next] as HTMLElement).click();
  }
}