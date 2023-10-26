// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

console.log('Starting TradingViewPlus...');

// Holds all features
const features = new Map<string, Feature>;

// Init storage service
const storageService = new StorageService('tvp-local-config');


// Disable default TV hotkeys
document.addEventListener("keypress", (event) => event.stopPropagation(), true);

// Register Events
document.addEventListener('keydown', (event: KeyboardEvent) => {[...features.values()].forEach(feature => feature.onKeyDown(event))});
document.addEventListener('keyup', (event: KeyboardEvent) => {[...features.values()].forEach(feature => feature.onKeyUp(event))});
document.addEventListener('mousemove', (event: MouseEvent) => {[...features.values()].forEach(feature => feature.onMouseMove(event))});
document.addEventListener('mousedown', (event: MouseEvent) => {[...features.values()].forEach(feature => feature.onMouseDown(event))});
document.addEventListener('wheel', (event: WheelEvent) => {[...features.values()].forEach(feature => feature.onMouseWheel(event))}, true);

// Register features
features.set('Auto Scale', new ToggleAutoScale(storageService));
features.set('Log Scale', new ToggleLogScale(storageService));
features.set('Auto Timeframe Colors', new ToggleAutoTimeframeColors(storageService));
features.set('Ad Blocker', new ToggleAdBlocker(storageService));
features.set('Copy Price', new CopyPrice(storageService));
features.set('Delete Drawing', new DeleteDrawing(storageService));
features.set('Symbol Search', new SymbolSearch(storageService));
features.set('Quick Toolbar', new QuickToolbar(storageService));
features.set('Invert Scale', new InvertScale(storageService));
features.set('Line Style', new LineStyle(storageService));
features.set('Line Width', new LineWidth(storageService));
features.set('Replay Mode', new ToggleReplay(storageService));
features.set('Scroll Price Scale', new ScrollPriceScale(storageService));
features.set('Scroll To Most Recent Bar', new ScrollToMostRecentBar(storageService));

//features.get('Toggle Auto Scale')?.setHotkey({
//  key: 'p',
//  ctrl: false,
//  shift: false,
//  alt: false,
//  meta: false
//});

// [TEMP] Fetch and inject HTML 
// make this into a service ( not hard-coded ) at some point. This is just for testing purposes.
fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
  if (document.getElementById('tvp-menu') == null) {
    document.body.insertAdjacentHTML('beforeend', html);
    runAfterInjection();
  }
})
