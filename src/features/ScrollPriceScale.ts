// ========= ScrollPriceScale =========
class ScrollPriceScale extends Feature {
  private scrollTimeout: number | null = null; // kept for compatibility
  private static readonly MULTIPLIER = 8;
  private static readonly BASE_STEP  = 100;

  // new: buffered flush + key-hold repeat
  private pendingDelta = 0;
  private flushTimer: number | null = null;
  private holdStartTimer: number | null = null;
  private holdInterval: number | null = null;
  private wheelQuietTimer: number | null = null; // NEW

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

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey 1 (Up)', () => {
        const lbl = document.getElementById(`${this.getName()}-hotkey-label`); if (lbl) lbl.textContent = '...';
        captureHotkey((res) => {
          const rerender = () => (document.querySelector('[id="tvp-menu"] input') as HTMLInputElement | null)
            ?.dispatchEvent(new InputEvent('input'));

          if (res === 'cancel') { snackBar('Keybind assignment canceled'); rerender(); return; }
          if (res === 'clear')  { this.setConfigValue('hotkey1', { key: null, ctrl:false, shift:false, alt:false, meta:false }); this.saveToLocalStorage(); snackBar('Hotkey 1 cleared'); rerender(); return; }

          const dupA = checkDuplicateHotkeys(features, res);
          const dupB = this.isSubDuplicate(features, res, 'hotkey1');
          if (!dupA && !dupB) { this.setConfigValue('hotkey1', res); this.saveToLocalStorage(); }
          else snackBar(dupA && dupA.reason !== 'duplicate' ? (dupA.reason === 'modifier_only' ? 'Error: Modifier-only keybinds are not supported' : 'Error: This key cannot be assigned')
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

          const dupA = checkDuplicateHotkeys(features, res);
          const dupB = this.isSubDuplicate(features, res, 'hotkey2');
          if (!dupA && !dupB) { this.setConfigValue('hotkey2', res); this.saveToLocalStorage(); }
          else snackBar(dupA && dupA.reason !== 'duplicate' ? (dupA.reason === 'modifier_only' ? 'Error: Modifier-only keybinds are not supported' : 'Error: This key cannot be assigned')
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
    const isWheelKey = e.key === 'WheelUp' || e.key === 'WheelDown';
    if (this.matchesSubHotkey(e, 'hotkey1')) {
      if (!isWheelKey) { this.queueScroll(+1, e); this.startKeyRepeat(+1); }
    }
    if (this.matchesSubHotkey(e, 'hotkey2')) {
      if (!isWheelKey) { this.queueScroll(-1, e); this.startKeyRepeat(-1); }
    }
  }
  onKeyUp(_e: KeyboardEvent) { this.stopKeyRepeat(); }
  onMouseMove(_e: MouseEvent) {}
  onMouseDownCapture?(_e: MouseEvent) {}
  init() {
    // Defaults: Shift + WheelUp/Down
    if (!this.getConfigValue('hotkey1'))
      this.setConfigValue('hotkey1', { key: 'WheelUp',   ctrl:false, shift:true, alt:false, meta:false }); // up the scale
    if (!this.getConfigValue('hotkey2'))
      this.setConfigValue('hotkey2', { key: 'WheelDown', ctrl:false, shift:true, alt:false, meta:false }); // down the scale
  }

  private isSubDuplicate(features: Map<string, Feature>, hk: Hotkey, selfSlot: 'hotkey1'|'hotkey2'): boolean {
    const same = (a?: Hotkey | null, b?: Hotkey | null) =>
      !!a && !!b && !!a.key && !!b.key &&
      a.key.toLowerCase() === b.key.toLowerCase() &&
      !!a.ctrl === !!b.ctrl && !!a.shift === !!b.shift && !!a.alt === !!b.alt && !!a.meta === !!b.meta;

    for (const [fname, f] of features) {
      for (let i = 1; i <= 8; i++) {
        const slot = `hotkey${i}`;
        if (fname === this.getName() && slot === selfSlot) continue;
        const ex = f.getConfigValue?.(slot) as Hotkey | undefined;
        if (same(ex, hk)) return true;
      }
    }
    return false;
  }

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

    const delta = (wheelAbsDelta ?? ScrollPriceScale.BASE_STEP)
                * ScrollPriceScale.MULTIPLIER
                * (direction > 0 ? -1 : +1);

    this.pendingDelta += delta;
    this.ensureFlushLoop();
  }

  private ensureFlushLoop() {
    if (this.flushTimer !== null) return;
    this.flushTimer = window.setInterval(() => {
      if (this.pendingDelta !== 0) {
        const d = this.pendingDelta;
        this.pendingDelta = 0;
        this.processScroll(d);
      } else {
        window.clearInterval(this.flushTimer!);
        this.flushTimer = null;
      }
    }, 16);
  }

  private startKeyRepeat(direction: 1 | -1) {
    if (this.holdStartTimer !== null || this.holdInterval !== null) return;
    this.holdStartTimer = window.setTimeout(() => {
      this.holdStartTimer = null;
      this.holdInterval = window.setInterval(() => {
        const step = ScrollPriceScale.BASE_STEP * ScrollPriceScale.MULTIPLIER * (direction > 0 ? -1 : +1);
        this.pendingDelta += step;
        this.ensureFlushLoop();
      }, 50);
    }, 300);
  }

  private stopKeyRepeat() { // CHANGED
    if (this.holdStartTimer !== null) { window.clearTimeout(this.holdStartTimer); this.holdStartTimer = null; }
    if (this.holdInterval   !== null) { window.clearInterval(this.holdInterval); this.holdInterval = null; }
    if (this.wheelQuietTimer!== null) { window.clearTimeout(this.wheelQuietTimer); this.wheelQuietTimer = null; }
    this.pendingDelta = 0;
    if (this.flushTimer     !== null) { window.clearInterval(this.flushTimer); this.flushTimer = null; }
  }

  private bumpWheelQuiet() { // NEW
    if (this.wheelQuietTimer !== null) window.clearTimeout(this.wheelQuietTimer);
    this.wheelQuietTimer = window.setTimeout(() => this.stopKeyRepeat(), 80);
  }


  private processScroll(deltaY: number) {
    const axis = document.querySelector('.price-axis') as HTMLElement | null; // was [class="price-axis"]
    if (!axis) return;
    const r = axis.getBoundingClientRect();
    const evt = new WheelEvent('wheel', {
      deltaY, bubbles: true, cancelable: true,
      clientX: Math.floor(r.left + 4),
      clientY: Math.floor(r.top + 4)
    });
    axis.dispatchEvent(evt);
  }
}
