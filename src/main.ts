// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

interface Feature {
  name: string;
  tooltip: string;
  enabled: boolean;
  hotkey: Hotkey | null;
  category: 'Features' | 'Display' | 'Settings';
}


interface Hotkey {
  key: string | null;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

const features: Record<string, FeatureClass> = {};

// Waits for element to load 
function waitForElm(selector: string): Promise<Element | null> {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

const questionMarkSvgString = `
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 fill='white' width="12px" height="12px" viewBox="0 0 40.124 40.124" style="enable-background:new 0 0 40.124 40.124;"
	 xml:space="preserve">
  <g>
    <g>
      <path d="M19.938,12.141c1.856,0,2.971,0.99,2.971,2.66c0,3.033-5.414,3.869-5.414,7.55c0,0.99,0.648,2.072,1.979,2.072
        c2.042,0,1.795-1.516,2.538-2.6c0.989-1.453,5.6-3,5.6-7.023c0-4.361-3.897-6.188-7.858-6.188c-3.773,0-7.24,2.692-7.24,5.725
        c0,1.237,0.929,1.887,2.012,1.887C17.525,16.225,15.979,12.141,19.938,12.141z"/>
      <path d="M22.135,28.973c0-1.393-1.145-2.537-2.537-2.537s-2.537,1.146-2.537,2.537c0,1.393,1.145,2.537,2.537,2.537
        S22.135,30.366,22.135,28.973z"/>
      <path d="M40.124,20.062C40.124,9,31.124,0,20.062,0S0,9,0,20.062s9,20.062,20.062,20.062S40.124,31.125,40.124,20.062z M2,20.062
        C2,10.103,10.103,2,20.062,2c9.959,0,18.062,8.103,18.062,18.062c0,9.959-8.103,18.062-18.062,18.062
        C10.103,38.124,2,30.021,2,20.062z"/>
    </g>
  </g>
</svg>`;

// Disable default TV hotkeys
document.addEventListener("keypress", (event) => event.stopPropagation(), true);


interface LocalConfig {
  hotkeys: Record<string, Feature>
  settings: {
    auto_colors: Record<string, number>;
    color_theme: string;
  };
}

//const local_config: LocalConfig = {
//  hotkeys: menu_contents,
//  settings: {
//    auto_colors: {
//      "1m": 0,
//      "3m": 49,
//      "5m": 11,
//      "15m": 13,
//      "1h": 15,
//      "4h": 12,
//      "D": 10,
//      "W": 18,
//    },
//    color_theme: 'dark',
//  },
//};

let config = new Map();

(async () => {
  // Set config if saved locally
  const localConfig = await browser.storage.local.get('tvp-local-config');
  if (Object.keys(localConfig).length > 0)  {
    config = new Map(Object.entries(JSON.parse(localConfig['tvp-local-config'])));
  }

  
  function stopPropagation(e: KeyboardEvent) {
    const activeElem = document.activeElement?.tagName;
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

})();

