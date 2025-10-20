class ZoomChart extends Feature {
  private zoomTimeout: number | null = null;
  private static readonly MULTIPLIER = 8;     // keep old *8 scaling
  private static readonly BASE_STEP  = 100;   // used when zoom is triggered by non-wheel inputs

  constructor() {
    super(
      'Zoom Chart',
      'Allows you to zoom both chart axes at once',
      true,
      { key: null, ctrl: false, shift: false, alt: false, meta: false }, // global accel unused
      Category.TVP,
      false,
      ['Ctrl', 'Shift', 'Scroll']
    );

    // Defaults mirror old Ctrl+Shift+Wheel behavior
    if (!this.getConfigValue('hotkey1'))
      this.setConfigValue('hotkey1', { key: 'WheelUp',   ctrl:true, shift:true, alt:false, meta:false });   // zoom in
    if (!this.getConfigValue('hotkey2'))
      this.setConfigValue('hotkey2', { key: 'WheelDown', ctrl:true, shift:true, alt:false, meta:false });   // zoom out

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey 1 (Zoom In)', () => {
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
      new ContextMenuListItem('Change Hotkey 2 (Zoom Out)', () => {
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
    const dir = e.deltaY < 0 ? +1 : -1; // up=in, down=out
    if (this.matchesSubHotkey(e, 'hotkey1') && dir === +1) return this.queueZoom(+1, e, Math.abs(e.deltaY));
    if (this.matchesSubHotkey(e, 'hotkey2') && dir === -1) return this.queueZoom(-1, e, Math.abs(e.deltaY));
  }
  onMouseDown(e: MouseEvent) {
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueZoom(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueZoom(-1, e);
  }
  onKeyDown(e: KeyboardEvent) {
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueZoom(+1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueZoom(-1, e);
  }
  onKeyUp(_e: KeyboardEvent) {}
  onMouseMove(_e: MouseEvent) {}
  onMouseDownCapture?(_e: MouseEvent) {}
  init() {}

  // ===== matching =====
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
  private queueZoom(direction: 1 | -1, e: Event, wheelAbsDelta?: number) {
    if (e.cancelable) { e.preventDefault(); e.stopPropagation(); }
    if (this.zoomTimeout) window.clearTimeout(this.zoomTimeout);
    const step = (wheelAbsDelta ?? ZoomChart.BASE_STEP) * ZoomChart.MULTIPLIER * (direction > 0 ? -1 : +1);
    // Note: WheelUp should yield negative deltaY, WheelDown positive
    this.zoomTimeout = window.setTimeout(() => { this.processZoom(step); this.zoomTimeout = null; }, 50);
  }

  private processZoom(deltaY: number) {
    // TradingView reacts to wheel on the price axis. Keep parity with old code.
    const priceAxis = document.querySelector('[class="price-axis"]');
    if (!priceAxis) return;
    const evt = new WheelEvent('wheel', {
      deltaY,
      bubbles: true,
      cancelable: true,
      clientX: 1, // ensure non-zero if any listeners check it
      clientY: 1
    });
    priceAxis.dispatchEvent(evt);
  }
}
