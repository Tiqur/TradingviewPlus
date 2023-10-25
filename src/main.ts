import StorageService from "./di/services/StorageService";

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
  console.log(storageService.fetchStorage());
})
