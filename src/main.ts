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
features.set('Quick Toolbar', new QuickToolbar());
features.set('Invert Scale', new InvertScale());
features.set('Line Style', new LineStyle());
features.set('Line Width', new LineWidth());
features.set('Replay Mode', new ToggleReplay());
features.set('Scroll Price Scale', new ScrollPriceScale());
features.set('Scroll To Most Recent Bar', new ScrollToMostRecentBar());
features.set('Toggle Menu', new ToggleMenu());
features.set('Move Time Left', new MoveTimeLeft());
features.set('Move Time Right', new MoveTimeRight());

// [TEMP] Fetch and inject HTML 
// make this into a service ( not hard-coded ) at some point. This is just for testing purposes.
fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
  const tvpMenu = document.getElementById('tvp-menu');
  if (tvpMenu == null) {
    document.body.insertAdjacentHTML('beforeend', html);
    menu.init();
  }
});
