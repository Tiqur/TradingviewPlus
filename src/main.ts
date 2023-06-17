// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

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

// Disable default TV hotkeys
document.addEventListener("keypress", (event) => event.stopPropagation(), true);

function initMenuResizeLogic() {
  const resize_bar = document.getElementById('tvp-resize-bar');
  const controlDiv = document.getElementById('tvp-resize-bar-container');
  const container = document.getElementById('tvp-menu');
  let menuContainerWidth = 400;
  let mouseDown = false;

  document.getElementById('tvp-resize-bar-container')?.addEventListener('mouseover', e => {
    if (resize_bar)
      resize_bar.style.background = '#d1d4dc';
  });
  document.getElementById('tvp-resize-bar-container')?.addEventListener('mouseout', e => {
    if (resize_bar)
      resize_bar.style.background = '#9598a1';
  });

  controlDiv?.addEventListener('mousedown', e => {
    mouseDown = true;
  })

  document.addEventListener('mouseup', e => {
    mouseDown = false;
  })

  document.addEventListener('mousemove', e => {
    if (mouseDown && container) {
      menuContainerWidth = window.innerWidth - e.clientX;
      if (menuContainerWidth > 400 && menuContainerWidth < window.innerWidth) {
        container.style.width = menuContainerWidth+'px';
      } else {
        menuContainerWidth = menuContainerWidth < 400 ? 400 : window.innerWidth;
        container.style.width = menuContainerWidth+'px';
      }
    }
  });
}

(async () => {
  fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
    document.body.insertAdjacentHTML('beforeend', html);
    await waitForElm('[id="tvp-resize-bar"]');
    initMenuResizeLogic();
  });
})();

