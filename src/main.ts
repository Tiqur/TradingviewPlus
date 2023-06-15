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

(async () => {
  fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(html => {
    document.body.insertAdjacentHTML('beforeend', html);
  });
})();
