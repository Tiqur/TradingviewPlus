// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

const features = new Map<string, Feature>;

// Main code
(async () => {
  console.log('Starting TradingViewPlus...');

  // Disable default TV hotkeys
  document.addEventListener("keypress", (event) => event.stopPropagation(), true);

  // Holds all features

  // Init storage service
  const storageService = new StorageService('tvp-local-config');

  // Register features
  features.set('Toggle Auto Scale', new ToggleAutoScale(storageService));
  features.get('Toggle Auto Scale')?.setHotkey({
        key: 'p',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      })
  //features.set('Toggle Auto Scale', new ToggleAutoScale(storageService));
  //features.set('Toggle Auto Scale', new ToggleAutoScale(storageService));
  //features.set('Toggle Auto Scale', new ToggleAutoScale(storageService));
  //features.set('Toggle Auto Scale', new ToggleAutoScale(storageService));

  // [TEMP] Fetch and inject HTML 
  // make this into a service ( not hard-coded ) at some point. This is just for testing purposes.
  fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
    if (document.getElementById('tvp-menu') == null) {
      document.body.insertAdjacentHTML('beforeend', html);
    }
  })
})();
