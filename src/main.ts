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

// Register features
features.set('Toggle Auto Scale', new ToggleAutoScale(storageService));
features.set('Toggle Log Scale', new ToggleLogScale(storageService));
features.set('Toggle Auto Timeframe Colors', new ToggleAutoTimeframeColors(storageService));
features.set('Toggle Ad Blocker', new ToggleAdBlocker(storageService));
//features.get('Toggle Auto Scale')?.setHotkey({
//  key: 'p',
//  ctrl: false,
//  shift: false,
//  alt: false,
//  meta: false
//});

// [TEMP] Fetch and inject HTML 
// make this into a service ( not hard-coded ) at some point. This is just for testing purposes.
//fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
//  if (document.getElementById('tvp-menu') == null) {
//    document.body.insertAdjacentHTML('beforeend', html);
//  }
//})
