// ========= TimeframeScroll =========
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

    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey 1 (Ltf)', () => {
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
      new ContextMenuListItem('Change Hotkey 2 (Htf)', () => {
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
    // direction from wheel
    const info = Feature.wheelInfoFromEvent(e);
    const dir = info.delta < 0 ? +1 : -1;
    // allow wheel-only path if mods match either bind
    if (this.matchesSubHotkey(e, 'hotkey1') && dir === +1) return this.queueStep(-1, e);
    if (this.matchesSubHotkey(e, 'hotkey2') && dir === -1) return this.queueStep(+1, e);
  }
  onMouseDown(e: MouseEvent) {
    // mouse buttons can trigger steps
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueStep(-1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueStep(+1, e);
  }
  onKeyDown(e: KeyboardEvent) {
    // keyboard keys can trigger steps
    if (this.matchesSubHotkey(e, 'hotkey1')) return this.queueStep(-1, e);
    if (this.matchesSubHotkey(e, 'hotkey2')) return this.queueStep(+1, e);
  }
  onKeyUp(_e: KeyboardEvent) {}
  onMouseMove(_e: MouseEvent) {}
  onMouseDownCapture?(_e: MouseEvent) {} // ignore if your base class doesn’t declare
  init() {
    if (!this.getConfigValue('hotkey1'))
      this.setConfigValue('hotkey1', { key: 'WheelUp',   ctrl:false, shift:true, alt:true,  meta:false }); // previous
    if (!this.getConfigValue('hotkey2'))
      this.setConfigValue('hotkey2', { key: 'WheelDown', ctrl:false, shift:true, alt:true,  meta:false }); // next
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
    return Feature.normalizeEventKey(ev);
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
