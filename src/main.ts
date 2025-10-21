// hmmmm
declare const chrome: any;
declare const DOMPurify: any;

const VERSION = "v5.0.4";

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

console.log('Starting TradingViewPlus...');

// Holds all features
const features = new Map<string, Feature>;

// Init menu
const menu = new TVPMenu();
menu.initEventSuppression();

// ===== Additive: central suppression gate (visibility-safe) =====
function tvp_isVisible(el: Element): boolean {
  const node = el as HTMLElement;
  if (!node) return false;
  if (node.getAttribute("aria-hidden") === "true") return false;

  const style = getComputedStyle(node);
  if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity) === 0) return false;

  const rect = node.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;

  return !(rect.right <= 0 || rect.bottom <= 0 || rect.left >= (window.innerWidth || 0) || rect.top >= (window.innerHeight || 0));
}

function tvp_menuOpen(): boolean {
  const el = document.getElementById("tvp-menu");
  if (!el) return false;
  try { return getComputedStyle(el).left === "0px"; } catch { return false; }
}

function tvp_isTyping(): boolean {
  const ae = document.activeElement as HTMLElement | null;
  if (!ae) return false;

  const isEditor =
    ae.tagName === "INPUT" ||
    ae.tagName === "TEXTAREA" ||
    ae.isContentEditable === true;

  if (!isEditor) return false;

  // Ignore hidden focus
  if (!tvp_isVisible(ae)) return false;

  // If focus is inside TVP menu but menu is closed, do not suppress
  if (ae.closest("#tvp-menu") && !tvp_menuOpen()) return false;

  return true;
}

function tvp_anyDialogOpen(): boolean {
  // Only treat visible TradingView dialogs as open
  const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
  for (const d of dialogs) if (tvp_isVisible(d)) return true;
  return false;
}

function tvp_isContextMenuOpen(): boolean {
  // TradingView's main right-click context menu heuristic
  const menus = Array.from(document.querySelectorAll('div[class*="menuWrap"]'));
  for (const el of menus) {
    const node = el as HTMLElement;
    if (!tvp_isVisible(node)) continue;

    // small tool menus have identifying attributes; skip those
    if (node.hasAttribute('data-name') || node.hasAttribute('data-qa-id')) continue;

    // main context menus render rows in a table with data-role="menuitem"
    if (node.querySelector('tr[data-role="menuitem"]')) return true;
  }
  return false;
}

function tvp_suppressHotkeysNow(): boolean {
  return (
    tvp_isTyping() ||
    tvp_menuOpen() ||
    tvp_anyDialogOpen() ||
    tvp_isContextMenuOpen()
  );
}

// Optional: expose for other modules / Feature.ts local guard
;(window as any).tvp_suppressHotkeysNow = tvp_suppressHotkeysNow;

// ===== Mouse-hotkey detection (unchanged) =====
const mouseTokens = new Set(['WheelUp','WheelDown','MouseLeft','MouseMiddle','MouseRight','Mouse4','Mouse5']);
const anyMouseHotkeys = () => {
  for (const [, f] of features) {
    const hk = (f as any).getHotkey?.() || (f as any).hotkey;
    if (hk?.key && mouseTokens.has(hk.key)) return true;

    const h1 = (f as any).getConfigValue?.('hotkey1');
    const h2 = (f as any).getConfigValue?.('hotkey2');
    if (h1?.key && mouseTokens.has(h1.key)) return true;
    if (h2?.key && mouseTokens.has(h2.key)) return true;
  }
  return false;
};

// Disable default TV hotkeys
document.addEventListener("keypress", (event) => event.stopPropagation(), true);

const mapBtn = (b:number)=> b===0?'MouseLeft':b===1?'MouseMiddle':b===2?'MouseRight':b===3?'Mouse4':b===4?'Mouse5':null;

function eventMatchesAssignedMouseHotkey(e: MouseEvent): boolean {
  const key = mapBtn(e.button); if (!key) return false;
  for (const [, f] of features) {
    const mods = (hk:any)=> hk && hk.key && hk.key.toLowerCase()===key.toLowerCase()
      && !!hk.ctrl===!!e.ctrlKey && !!hk.shift===!!e.shiftKey && !!hk.alt===!!e.altKey && !!hk.meta===!!(e as any).metaKey;
    const hk = (f as any).getHotkey?.();
    if (mods(hk)) return true;
    const h1 = (f as any).getConfigValue?.('hotkey1');
    const h2 = (f as any).getConfigValue?.('hotkey2');
    if (mods(h1) || mods(h2)) return true;
  }
  return false;
}

// Register Events
document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (tvp_suppressHotkeysNow()) return;
  [...features.values()].forEach(feature => feature.onKeyDown(event));
}, true);

document.addEventListener('keyup', (event: KeyboardEvent) => {
  if (tvp_suppressHotkeysNow()) return;
  [...features.values()].forEach(feature => feature.onKeyUp(event));
}, true);

// Wheel → synthetic “key” event
document.addEventListener('wheel', (e) => {
  if (tvp_suppressHotkeysNow()) return;
  if (!anyMouseHotkeys()) return;
  const key = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
  const synthetic = { key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: (e as any).metaKey } as KeyboardEvent;
  for (const [, feature] of features) feature.onKeyDown?.(synthetic);
}, { capture: true });

// Mouse down/up → synthetic key events
document.addEventListener('mousedown', (e) => {
  if (tvp_suppressHotkeysNow()) return;
  if (!anyMouseHotkeys()) return;
  const mapBtn = (b: number) => b === 0 ? 'MouseLeft' : b === 1 ? 'MouseMiddle' : b === 2 ? 'MouseRight' : b === 3 ? 'Mouse4' : b === 4 ? 'Mouse5' : null;
  const key = mapBtn(e.button);
  if (!key) return;
  const synthetic = { key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: (e as any).metaKey } as KeyboardEvent;
  for (const [, feature] of features) feature.onKeyDown?.(synthetic);
}, { capture: true });

document.addEventListener('mouseup', (e) => {
  if (tvp_suppressHotkeysNow()) return;
  if (eventMatchesAssignedMouseHotkey(e)) { e.preventDefault(); e.stopPropagation(); }
  const key = mapBtn(e.button); if (!key) return;
  const synthetic = { key, ctrlKey:e.ctrlKey, shiftKey:e.shiftKey, altKey:e.altKey, metaKey:(e as any).metaKey } as KeyboardEvent;
  for (const [, feature] of features) feature.onKeyUp?.(synthetic);
}, { capture: true });

document.addEventListener('auxclick', (e) => {
  if (tvp_suppressHotkeysNow()) return;
  if (eventMatchesAssignedMouseHotkey(e)) { e.preventDefault(); e.stopPropagation(); }
}, { capture: true });

// Forward real wheel events to features (needed for TimeframeScroll, etc.)
document.addEventListener(
  'wheel',
  (event: WheelEvent) => {
    if (tvp_suppressHotkeysNow()) return; // additive guard
    // let features call preventDefault on wheel
    for (const [, feature] of features) feature.onMouseWheel(event);
  },
  { capture: true, passive: false }  // <- passive: false is required
);

// Forward real mouse events to features
document.addEventListener('mousedown', (event: MouseEvent) => {
  if (tvp_suppressHotkeysNow()) return;
  for (const [, feature] of features) feature.onMouseDown(event);
}, { capture: true });

document.addEventListener('mousemove', (event: MouseEvent) => {
  if (tvp_suppressHotkeysNow()) return;
  for (const [, feature] of features) feature.onMouseMove(event);
}, { capture: true });

// Register features
features.set('Auto Scale', new ToggleAutoScale());
features.set('Log Scale', new ToggleLogScale());
features.set('Auto Timeframe Colors', new AutoTimeframeColors());
features.set('Toggle Auto Timeframe Colors', new ToggleAutoTimeframeColors());
features.set('Ad Blocker', new ToggleAdBlocker());
features.set('Copy Price', new CopyPrice());
features.set('Delete Drawing', new DeleteDrawing());
features.set('Symbol Search', new SymbolSearch());
features.set('Invert Scale', new InvertScale());
features.set('Line Style', new LineStyle());
features.set('Line Width', new LineWidth());
features.set('Replay Mode', new ToggleReplay());
features.set('Scroll To Most Recent Bar', new ScrollToMostRecentBar());
features.set('Toggle Menu', new ToggleMenu());
features.set('Move Time Left', new MoveTimeLeft());
features.set('Move Time Right', new MoveTimeRight());
features.set('Quick Toolbar', new QuickToolbar());
features.set('Timeframe Scroll', new TimeframeScroll());
features.set('Scroll Price Scale', new ScrollPriceScale());
features.set('Zoom Chart', new ZoomChart());

// Create TVP background
const tvp_background = document.createElement('div');
tvp_background.id = 'tvp-background';
if (document.getElementById('tvp-background') == null) {
  document.body.insertAdjacentElement('beforeend', tvp_background);
}



// Fetch and inject Changelog pop-up HTML 
// This should likely be changed into a feature at some point
fetch(browser.runtime.getURL('public/changelog_popup.html')).then(r => r.text()).then(async html => {
  // Sanitize HTML
  const sanitized_html = DOMPurify.sanitize(html);

  // Parse HTML into HTMLElement
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized_html, 'text/html');
  const element = doc.body.firstChild;

  document.body.insertAdjacentElement('beforeend', element as Element);

  // Inject current version
  const changelogVersion = document.getElementById('tvp-changelog-version');
  if (changelogVersion) {
    changelogVersion.innerText = `${VERSION} Changelog`;
  }

  const popupElement = document.getElementById('tvp-changelog-popup');

  // If extension version in cookies is different than current version, show pop-up then update it.
  const version = await browser.storage.local.get('tvp_version');

  if (version['tvp_version'] != VERSION) {
    popupElement?.toggleAttribute('open');
    await browser.storage.local.set({tvp_version: VERSION});
  }

  // Close pop-up
  const changelogConfirmButton = document.getElementById('tvp-changelog-confirm');
  changelogConfirmButton?.addEventListener('click', () => {
    popupElement?.removeAttribute('open');
  })
});



// [TEMP] Fetch and inject TVP menu HTML 
// make this into a service ( not hard-coded ) at some point. This is just for testing purposes.
fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
  // Sanitize HTML
  const sanitized_html = DOMPurify.sanitize(html);

  // Parse HTML into HTMLElement
  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitized_html, 'text/html');
  const element = doc.body.firstChild;

  const tvpMenu = document.getElementById('tvp-menu');
  if (tvpMenu == null && element != null) {
    document.body.insertAdjacentElement('beforeend', element as Element);
    menu.init();
  }
});