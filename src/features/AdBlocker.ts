class ToggleAdBlocker extends Feature {
  
  constructor(storageService: StorageService) {
    super(
      'Toggle Ad Blocker',
      'Toggles the TVP\'s built in Ad blocker',
      true,
      {
        key: ']',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      storageService
    );
  }

  onMouseDown() {};

  onMouseMove() {};

  onKeyDown() {};

  init() {

    // Search for ad blocker close button and click once it appears
    const config = { childList: true, subtree: true };

    // Observer for ads
    new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const adCloseButton = document.querySelector('button[class*="ads-toast-close-button"]');
          if (adCloseButton != null && this.isEnabled()) {
            (adCloseButton as HTMLElement).click();
          }
        }
      }
    }).observe(document.body, config);

    // Observer for modal ( for TV premium )
    new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const modalElement = document.querySelector('[class*="modal"]');
          if (modalElement != null && this.isEnabled() && modalElement?.innerHTML.includes('Go ad-free. Everywhere')) {
            const modalCloseButton = document.querySelector('[class*="modal"] button');
            (modalCloseButton as HTMLElement).click();
          }
        }
      }
    }).observe(document.body, config);

    // Toggle enabled
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e)) {
        this.toggleEnabled();
      }
    });
  }
}
