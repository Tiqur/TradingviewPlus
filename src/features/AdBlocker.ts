class ToggleAdBlocker extends Feature {
  
  constructor() {
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
      true
    );
    this.addContextMenuOptions([
      new ContextMenuListItem('Change Hotkey', () => {
       let hotkey = {
          key: '',
          ctrl: false,
          shift: false,
          alt: false,
          meta: false,
        };

        // Get label element
        const hotkeyLabel = document.getElementById(`${this.getName()}-hotkey-label`);
        if (!hotkeyLabel) return;

        // Wait for key to be pressed
        hotkeyLabel.innerText = '...';

        const keydownListener = (event: KeyboardEvent) => {
          if (event.key !== 'Meta' && event.key !== 'Shift' && event.key !== 'Control' && event.key !== 'Alt') {
            hotkey.key = event.key;
            hotkey.ctrl = event.ctrlKey;
            hotkey.shift = event.shiftKey;
            hotkey.alt = event.altKey;
            hotkey.meta = event.metaKey;

            event.preventDefault();
          }
        }

        const keyupListener = () => {
          // Update 'this.hotkey' with the newly selected hotkey
          console.log("new hotkey:", hotkey);
          this.setHotkey(hotkey)

          // Re-render menu while maintaining fuzzy search results
          // This is kinda hacky
          const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;
          textBox.dispatchEvent(new InputEvent('input'));

          // Remove event listeners to stop listening for hotkey input
          document.removeEventListener('keydown', keydownListener);
          document.removeEventListener('keyup', keyupListener);
        }

        document.addEventListener('keyup', keyupListener);
        document.addEventListener('keydown', keydownListener);

        console.log("Change Hotkey triggered");
      }),
      new ContextMenuListItem('Change Hotkey', () => {
        console.log("Change Hotkey triggered");
      })
    ]);
  }

  onMouseDown() {};

  onMouseMove() {};

  onKeyDown() {};

  onMouseWheel() {};

  onKeyUp() {};

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
