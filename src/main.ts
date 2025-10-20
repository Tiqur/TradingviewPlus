// hmmmm
declare const chrome: any;

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

// Register Events
document.addEventListener('keydown', (event: KeyboardEvent) => {[...features.values()].forEach(feature => feature.onKeyDown(event))});
document.addEventListener('keyup', (event: KeyboardEvent) => {[...features.values()].forEach(feature => feature.onKeyUp(event))});

// Wheel → synthetic “key” event
document.addEventListener('wheel', (e) => {
  if (!anyMouseHotkeys()) return;
  const key = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
  const synthetic = { key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: (e as any).metaKey } as KeyboardEvent;
  for (const [, feature] of features) feature.onKeyDown?.(synthetic);
}, { capture: true });

// Mouse down/up → synthetic key events
document.addEventListener('mousedown', (e) => {
  if (!anyMouseHotkeys()) return;
  const mapBtn = (b: number) => b === 0 ? 'MouseLeft' : b === 1 ? 'MouseMiddle' : b === 2 ? 'MouseRight' : b === 3 ? 'Mouse4' : b === 4 ? 'Mouse5' : null;
  const key = mapBtn(e.button);
  if (!key) return;
  const synthetic = { key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: (e as any).metaKey } as KeyboardEvent;
  for (const [, feature] of features) feature.onKeyDown?.(synthetic);
}, { capture: true });

document.addEventListener('mouseup', (e) => {
  if (!anyMouseHotkeys()) return;
  const mapBtn = (b: number) => b === 0 ? 'MouseLeft' : b === 1 ? 'MouseMiddle' : b === 2 ? 'MouseRight' : b === 3 ? 'Mouse4' : b === 4 ? 'Mouse5' : null;
  const key = mapBtn(e.button);
  if (!key) return;
  const synthetic = { key, ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: (e as any).metaKey } as KeyboardEvent;
  for (const [, feature] of features) feature.onKeyUp?.(synthetic);
}, { capture: true });

// Forward real wheel events to features (needed for TimeframeScroll, etc.)
document.addEventListener(
  'wheel',
  (event: WheelEvent) => {
    // let features call preventDefault on wheel
    for (const [, feature] of features) feature.onMouseWheel(event);
  },
  { capture: true, passive: false }  // <- passive: false is required
);

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