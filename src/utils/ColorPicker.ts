/**
 * ColorPicker — the colour picker of Auto Timeframe Colors' Colors menu, laid out like
 * TradingView's own: the palette, the custom colours with + after them, and + replacing
 * the panel with a hex field and a hue / saturation area.
 *
 * The custom colours are TradingView's own list (read and changed through PageBridge),
 * so colours added or removed here and in TradingView's picker are the same.
 */
class ColorPicker {
  readonly element: HTMLElement;
  // The colour being edited, as 'rgb(r, g, b)'; it is marked in the palette
  private selected = '';
  private onChoose: (color: string) => void;
  private palette: string[];

  constructor(palette: string[], onChoose: (color: string) => void) {
    this.palette = palette;
    this.onChoose = onChoose;
    this.element = document.createElement('div');
    this.element.className = 'tvp-picker';
  }

  open(selected: string) {
    this.selected = selected;
    this.showPalette();
  }

  // ─── Palette ───────────────────────────────────────────────────────────────

  private showPalette() {
    const swatch = (color: string) => {
      const button = document.createElement('button');
      button.className = 'tvp-picker-swatch';
      button.style.backgroundColor = color;
      // The style reads back as rgb(...), so palette and custom colours compare alike
      const rgb = button.style.backgroundColor;
      if (rgb === this.selected) button.classList.add('selected');
      if (rgb === 'rgb(255, 255, 255)') button.classList.add('white');
      button.addEventListener('click', () => this.onChoose(rgb));
      return button;
    };
    const rows = (colors: string[]) => {
      const block = document.createElement('div');
      block.className = 'tvp-picker-swatches';
      block.append(...colors.map(swatch));
      return block;
    };

    // As in TradingView: the first two rows, a gap, the other rows, a line, the custom colours
    const separator = document.createElement('div');
    separator.className = 'tvp-picker-separator';
    const customColors = ColorPicker.customColors();
    const custom = rows(customColors);
    custom.querySelectorAll<HTMLElement>('.tvp-picker-swatch').forEach((button, i) => {
      button.addEventListener('contextmenu', e => this.showRemoveMenu(e, customColors[i]));
    });
    const add = document.createElement('button');
    add.className = 'tvp-picker-plus';
    add.title = 'Add custom color';
    add.innerHTML = DOMPurify.sanitize('<svg width="17" height="17" viewBox="0 0 17 17"><path d="M8.5 2.5v12M2.5 8.5h12" stroke="currentColor" stroke-width="1.2"/></svg>');
    add.addEventListener('click', () => this.showAdd());
    custom.appendChild(add);

    this.element.replaceChildren(rows(this.palette.slice(0, 20)), rows(this.palette.slice(20)), separator, custom);
  }

  // TradingView's right-click menu on a custom colour: one "Remove color" item at the cursor
  private showRemoveMenu(e: MouseEvent, stored: string) {
    e.preventDefault();
    this.element.querySelector('.tvp-picker-remove')?.remove();
    const menu = document.createElement('div');
    menu.className = 'tvp-picker-remove';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    const item = document.createElement('div');
    item.innerHTML = DOMPurify.sanitize(`
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.2">
        <path d="M3 4.5h12M7 4.5V3h4v1.5M4.5 4.5l.8 10.5h7.4l.8-10.5M7.5 7.5v5M10.5 7.5v5"/>
      </svg>
      <span>Remove color</span>`);
    item.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('tvp-remove-custom-color', { detail: stored }));
      this.showPalette();
    });
    menu.appendChild(item);
    this.element.appendChild(menu);
    // Any other click closes it
    setTimeout(() => document.addEventListener('mousedown', ev => {
      if (!menu.contains(ev.target as Node)) menu.remove();
    }, { once: true }));
  }

  // TradingView's custom colours, from PageBridge (none where it doesn't run). The reply
  // comes back during dispatchEvent, so this is synchronous.
  private static customColors(): string[] {
    let colors: string[] = [];
    const reply = (e: Event) => { colors = JSON.parse((e as CustomEvent).detail); };
    document.addEventListener('tvp-custom-colors', reply);
    document.dispatchEvent(new CustomEvent('tvp-get-custom-colors'));
    document.removeEventListener('tvp-custom-colors', reply);
    return colors;
  }

  // ─── Add custom colour ─────────────────────────────────────────────────────

  // Replaces the panel, as TradingView's + does: preview, hex field and Add, and the
  // hue / saturation area under them.
  private showAdd() {
    const start = (this.selected.match(/\d+/g) || ['41', '98', '255']).slice(0, 3);
    let [h, s, v] = ColorPicker.toHsv(start.map(n => Number(n).toString(16).padStart(2, '0')).join(''));

    const form = document.createElement('form');
    form.className = 'tvp-picker-form';
    const preview = document.createElement('div');
    preview.className = 'tvp-picker-preview';
    const hexWrap = document.createElement('label');
    hexWrap.className = 'tvp-picker-hex';
    const hash = document.createElement('span');
    hash.textContent = '#';
    const hex = document.createElement('input');
    hex.type = 'text';
    hex.maxLength = 7;
    hexWrap.append(hash, hex);
    const addButton = document.createElement('button');
    addButton.className = 'tvp-picker-add';
    addButton.textContent = 'Add';
    form.append(preview, hexWrap, addButton);

    const area = document.createElement('div');
    area.className = 'tvp-picker-area';
    const saturation = document.createElement('div');
    saturation.className = 'tvp-picker-saturation';
    const satPointer = document.createElement('div');
    satPointer.className = 'tvp-picker-saturation-pointer';
    saturation.appendChild(satPointer);
    const hue = document.createElement('div');
    hue.className = 'tvp-picker-hue';
    const huePointer = document.createElement('div');
    huePointer.className = 'tvp-picker-hue-pointer';
    hue.appendChild(huePointer);
    area.append(saturation, hue);

    // Shows h, s, v everywhere; the hex field is left alone while it's being typed in
    const render = (fromInput = false) => {
      const color = '#' + ColorPicker.toHex(h, s, v);
      preview.style.backgroundColor = color;
      saturation.style.backgroundColor = `hsl(${h}, 100%, 50%)`;
      satPointer.style.left = s * 100 + '%';
      satPointer.style.top = (1 - v) * 100 + '%';
      huePointer.style.top = h / 360 * 100 + '%';
      if (!fromInput) hex.value = color.slice(1);
    };
    render();

    hex.addEventListener('input', () => {
      const digits = hex.value.replace('#', '');
      if (/^[0-9a-f]{6}$/i.test(digits)) {
        [h, s, v] = ColorPicker.toHsv(digits);
        render(true);
      }
    });
    ColorPicker.drag(saturation, (x, y) => { s = x; v = 1 - y; render(); });
    ColorPicker.drag(hue, (x, y) => { h = y * 360; render(); });

    form.addEventListener('submit', e => {
      e.preventDefault();
      const digits = hex.value.replace('#', '');
      if (!/^[0-9a-f]{6}$/i.test(digits)) { hex.focus(); return; }
      this.onChoose('rgb(' + [0, 2, 4].map(i => parseInt(digits.slice(i, i + 2), 16)).join(', ') + ')');
    });

    const panel = document.createElement('div');
    panel.className = 'tvp-picker-add-panel';
    panel.append(form, area);
    this.element.replaceChildren(panel);
    hex.focus();
    hex.select();
  }

  // Calls update with the pointer's position in the element (0..1 each way) while dragging
  private static drag(el: HTMLElement, update: (x: number, y: number) => void) {
    el.addEventListener('mousedown', down => {
      down.preventDefault();
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        const clamp = (n: number) => Math.min(Math.max(n, 0), 1);
        update(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
      };
      move(down);
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', () => document.removeEventListener('mousemove', move), { once: true });
    });
  }

  // 'rrggbb' to hue (0..360), saturation and value (0..1)
  private static toHsv(hex: string): [number, number, number] {
    const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b);
    const d = max - Math.min(r, g, b);
    const h = d === 0 ? 0 : max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return [h * 60, max === 0 ? 0 : d / max, max];
  }

  private static toHex(h: number, s: number, v: number): string {
    const channel = (n: number) => {
      const k = (n + h / 60) % 6;
      return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    return [channel(5), channel(3), channel(1)].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  }
}
