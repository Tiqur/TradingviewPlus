// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Waits for element to load 
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// Timeframe and color positions
let timeframeConfig = new Map();

// Disable default TV hotkeys
document.addEventListener("keypress", event => event.stopPropagation(), true);

(async () => {
  // Set config if saved locally
  const localConfig = await browser.storage.local.get('localConfig');
  if (Object.keys(localConfig).length > 0) timeframeConfig = new Map(Object.entries(JSON.parse(localConfig['localConfig'])));

  // Inject button
  injectAddon();

  // Enable features
  enableLineWidthHotkey('w');
  enableLineStyleHotkey('q');
  enableAutoScaleHotkey('a');
  enableReplayHotkey('r');
  enableCopyPriceHotkey('c');
  enablePriceScroll("Shift");
  enableTimeframeScroll("Tab");
  enableAutoTimeframeColors();
})();
