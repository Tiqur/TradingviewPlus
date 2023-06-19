class ToggleInvertScale extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        const element = document.getElementsByClassName('price-axis')[0];
        const boundingRect = element.getBoundingClientRect();

        element.dispatchEvent(new MouseEvent('contextmenu', {"clientX": boundingRect.x, "clientY": boundingRect.y}));

        // Wait for context menu to pop up
        waitForElm('[data-label="true"]').then(e => {
          // All elements in menu
          const elements = document.querySelectorAll('[data-label="true"]');

          // Loop through context menu to find "Copy price"
          for (var i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (el.innerText === "Invert scale") {
              // Click element
              el.click();
              break;
            }
          }
        });

        //snackBar('Inverted Scale');
      }
    });
  }
}

features['Toggle Invert Scale'] = new ToggleInvertScale({
  name: 'Toggle Invert Scale',
  tooltip: 'Toggles the inversion of the price axis',
  enabled: true,
  hotkey: {
    key: 'e',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features',
  action: () => {}
});

