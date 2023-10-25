// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Disable default TV hotkeys
document.addEventListener("keypress", (event) => event.stopPropagation(), true);

console.debug('setup');
