// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

// All default tradingview colors
const defaultColors = ["rgb(255, 255, 255)","rgb(209, 212, 220)","rgb(178, 181, 190)","rgb(149, 152, 161)","rgb(120, 123, 134)","rgb(93, 96, 107)","rgb(67, 70, 81)","rgb(42, 46, 57)","rgb(19, 23, 34)","rgb(0, 0, 0)","rgb(242, 54, 69)","rgb(255, 152, 0)","rgb(255, 235, 59)","rgb(76, 175, 80)","rgb(8, 153, 129)","rgb(0, 188, 212)","rgb(41, 98, 255)","rgb(103, 58, 183)","rgb(156, 39, 176)","rgb(233, 30, 99)","rgb(252, 203, 205)","rgb(255, 224, 178)","rgb(255, 249, 196)","rgb(200, 230, 201)","rgb(172, 229, 220)","rgb(178, 235, 242)","rgb(187, 217, 251)","rgb(209, 196, 233)","rgb(225, 190, 231)","rgb(248, 187, 208)","rgb(250, 161, 164)","rgb(255, 204, 128)","rgb(255, 245, 157)","rgb(165, 214, 167)","rgb(112, 204, 189)","rgb(128, 222, 234)","rgb(144, 191, 249)","rgb(179, 157, 219)","rgb(206, 147, 216)","rgb(244, 143, 177)","rgb(247, 124, 128)","rgb(255, 183, 77)","rgb(255, 241, 118)","rgb(129, 199, 132)","rgb(66, 189, 168)","rgb(77, 208, 225)","rgb(91, 156, 246)","rgb(149, 117, 205)","rgb(186, 104, 200)","rgb(240, 98, 146)","rgb(247, 82, 95)","rgb(255, 167, 38)","rgb(255, 238, 88)","rgb(102, 187, 106)","rgb(34, 171, 148)","rgb(38, 198, 218)","rgb(49, 121, 245)","rgb(126, 87, 194)","rgb(171, 71, 188)","rgb(236, 64, 122)","rgb(178, 40, 51)","rgb(245, 124, 0)","rgb(251, 192, 45)","rgb(56, 142, 60)","rgb(5, 102, 86)","rgb(0, 151, 167)","rgb(24, 72, 204)","rgb(81, 45, 168)","rgb(123, 31, 162)","rgb(194, 24, 91)","rgb(128, 25, 34)","rgb(230, 81, 0)","rgb(245, 127, 23)","rgb(27, 94, 32)","rgb(0, 51, 42)","rgb(0, 96, 100)","rgb(12, 50, 153)","rgb(49, 27, 146)","rgb(74, 20, 140)","rgb(136, 14, 79)"]

// Default colors for autotimeframe
const defaultExtensionColors = {
  '1m': 0,
  '3m': 49,
  '5m': 11,
  '15m': 13,
  '1h': 15,
  '4h': 12,
  'D': 10,
  'W': 18,
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
  if (Object.keys(localConfig).length > 0)  {
    timeframeConfig = new Map(Object.entries(JSON.parse(localConfig['localConfig'])));
  }

  // Inject button
  injectAddon();


  function stopPropagation(e) {
    const activeElem = document.activeElement.tagName;
    // Return false if custom keybind
    if (e.code === 'custom') return false;

    // Keep escape as global key
    if (e.key === 'Escape') return false;

    // Return if focused area is text input
    if (activeElem === 'INPUT' || activeElem === 'TEXTAREA') return true;

    // Return if alt or ctrl are held ( and not bubbles can also send default TV keybinds )
    //if ((e.ctrlKey || e.altKey)) return true;

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
  enableSelectTicker('t');
  enableScrollFeatures("Shift");
  enableTimeframeScroll("Tab");
  enableScrollToMostRecentBar("f");
  enableTimeMovementHotkeys("z", "x");
  enableAutoTimeframeColors();
  enableFavoritesToolbarHotkeys();

})();
