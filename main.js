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


  function stopPropagation(e) {
    const activeElem = document.activeElement.tagName;
    console.log(e)
    // Return false if custom keybind
    if (e.code === 'custom') return false;

    // Keep escape as global key
    if (e.key === 'Escape') return false;

    // Return if focused area is text input
    if (activeElem === 'INPUT' || activeElem === 'TEXTAREA') return true;

    // Return if alt or ctrl are held ( and not bubbles can also send default TV keybinds )
    if ((e.ctrlKey || e.altKey)) return true;
    console.log(e.bubbles)

    return false;
  }

  // Don't trigger hotkeys if ctrl, alt, or focused on text input
  document.addEventListener("keydown", e => !stopPropagation(e) || e.stopPropagation(), true);

  // Enable features
  enableLineWidthHotkey('w');
  enableLineStyleHotkey('q');
  enableAutoScaleHotkey('a');
  enableInverScaleHotkey('e');
  enableReplayHotkey('r');
  enableToggleAutotimeframeColorsHotkey('s');
  enableCopyPriceHotkey('c');
  enableDeleteDrawingHotkey('d');
  enablePriceScroll("Shift");
  enableTimeframeScroll("Tab");
  enableScrollToMostRecentBar("f");
  enableTimeMovementHotkeys("z", "x");
  enableAutoTimeframeColors();
  enableFavoritesToolbarHotkeys();

})();
