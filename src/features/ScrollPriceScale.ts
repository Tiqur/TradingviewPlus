class ScrollPriceScale extends Feature {
  private scrollTimeout: number | null = null;
  private static readonly MULTIPLIER = 8;
  private static readonly BASE_STEP  = 100;

  constructor() {
    super(
      'Scroll Price Scale',
      'Allows you to scroll the price scale using a hotkey + the scroll wheel',
      true,
      { key: null, ctrl: false, shift: false, alt: false, meta: false },
      Category.TVP,
      false,
      ['Shift', 'Scroll']
    );

    // Defaults: Shift + WheelUp/Down
    if (!this.getConfigValue('hotkey1'))
      this.setConfigValue('hotkey1', { key: 'WheelUp',   ctrl:false, shift:true, alt:false, meta:false }); // up the scale
    if (!this.getConfigValue('hotkey2'))
      this.setConfigValue('hotkey2', { key: 'WheelDown', ctrl:false, shift:true, alt:false, meta:false }); // down the scale

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey 1 (Up)', () => {
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
      new ContextMenuListItem('Change Hotkey 2 (Down)', () => {
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
    const dir = e.deltaY < 0 ? +1 : -1;
    if (this.matchesSubHotkey(e, 'hotkey1') && dir === +1) return this.queueScroll(+1, e, Math.abs(e.deltaY));
    if (this.matchesSubHotkey(e, 'hotkey2') && dir === -1) return this.queueScroll(-1, e, Math.abs(e.deltaY));
  }
  onMouseDown(e: MouseEvent) {
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueScroll(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueScroll(-1, e);
  }
  onKeyDown(e: KeyboardEvent) {
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueScroll(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueScroll(-1, e);
  }
  onKeyUp(_e: KeyboardEvent) {}
  onMouseMove(_e: MouseEvent) {}
  onMouseDownCapture?(_e: MouseEvent) {}
  init() {}

  // ===== matching helpers =====
  private matchesSubHotkey(ev: KeyboardEvent | MouseEvent | WheelEvent, which: 'hotkey1'|'hotkey2'): boolean {
    const hk = this.getConfigValue(which) as Hotkey | undefined;
    return this.matches(hk, ev);
  }
  private normalizeEventKey(ev: KeyboardEvent | MouseEvent | WheelEvent): string | null {
    if ('key' in ev) return ev.key;
    if ('deltaY' in ev) return ev.deltaY < 0 ? 'WheelUp' : 'WheelDown';
    if ('button' in ev) {
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

  // ===== action =====
  private queueScroll(direction: 1 | -1, e: Event, wheelAbsDelta?: number) {
    // Block native chart scroll so only the price scale moves
    if (e.cancelable) { e.preventDefault(); e.stopPropagation(); }
    if (this.scrollTimeout) window.clearTimeout(this.scrollTimeout);

    // TradingView treats positive deltaY as “down”. Match wheel semantics.
    const deltaY = (wheelAbsDelta ?? ScrollPriceScale.BASE_STEP)
                 * ScrollPriceScale.MULTIPLIER
                 * (direction > 0 ? -1 : +1);

    this.scrollTimeout = window.setTimeout(() => { this.processScroll(deltaY); this.scrollTimeout = null; }, 50);
  }

  private processScroll(deltaY: number) {
    const priceAxis = document.querySelector('[class="price-axis"]');
    if (!priceAxis) return;

    const evt = new WheelEvent('wheel', {
      deltaY,
      bubbles: true,
      cancelable: true,
      clientX: 1, // ensure non-zero so consumers that check it proceed
      clientY: 1
    });
    priceAxis.dispatchEvent(evt);
  }
}
