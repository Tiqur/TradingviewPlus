// hmmmm
declare const chrome: any;

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

// Disable default TV hotkeys
document.addEventListener("keypress", (event) => event.stopPropagation(), true);

// Register Events
document.addEventListener('keydown', (event: KeyboardEvent) => {[...features.values()].forEach(feature => feature.onKeyDown(event))});
document.addEventListener('keyup', (event: KeyboardEvent) => {[...features.values()].forEach(feature => feature.onKeyUp(event))});
document.addEventListener('mousemove', (event: MouseEvent) => {[...features.values()].forEach(feature => feature.onMouseMove(event))});
document.addEventListener('mousedown', (event: MouseEvent) => {[...features.values()].forEach(feature => feature.onMouseDown(event))});
document.addEventListener('wheel', (event: WheelEvent) => {[...features.values()].forEach(feature => feature.onMouseWheel(event))}, true);

// Register features
features.set('Auto Scale', new ToggleAutoScale());
features.set('Log Scale', new ToggleLogScale());
features.set('Auto Timeframe Colors', new ToggleAutoTimeframeColors());
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

// [TEMP] Fetch and inject HTML 
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
