// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Main code
(async () => {
  console.log('Starting TradingViewPlus...');

  // Disable default TV hotkeys
  document.addEventListener("keypress", (event) => event.stopPropagation(), true);

  const storageService = new StorageService('tvp-local-config');
  console.log(await storageService.fetchStorage());

  const features = new Map<string, Feature>;



  class ToggleAutoScale extends Feature {
    
    constructor() {
      super(
        'Toggle Auto Scale',
        'Toggles the chart\'s "Auto" scale',
        true,
        new Keybind({
          key: 'a',
          ctrl: false,
          shift: false,
          alt: false,
          meta: false
        }),
        Category.TVP,
        storageService
      );
    }

    init() {
      document.addEventListener('keydown', e => {
        if (this.checkTrigger(e) && this.isEnabled()) {
          (document.querySelector('[data-name="auto"]') as HTMLElement).click();
        }
      });
    }
  }

  features.set('Toggle Auto Scale', new ToggleAutoScale())

  // [TEMP] Fetch and inject HTML 
  // make this into a service ( not hard-coded ) at some point. This is just for testing purposes.
  fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
    if (document.getElementById('tvp-menu') == null) {
      document.body.insertAdjacentHTML('beforeend', html);
    }
  })
})();
