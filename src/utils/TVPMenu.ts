class TVPMenu {
  constructor() {
  }

  init() {
    this.initResizeLogic();
    this.injectFeatures(Array.from(features.values()));
    this.initFuzzySearch();
  }

  initEventSuppression() {
    function stopPropagation(e: KeyboardEvent) {
      const activeElem = document.activeElement?.tagName;

      // Return false if custom keybind
      if (e.code === 'custom') return false;

      // Keep escape as global key
      if (e.key === 'Escape') {
        if (menu.isOpen())
          menu.toggle();
        return false
      };

      // Return if focused area is text input
      if (activeElem === 'INPUT' || activeElem === 'TEXTAREA') return true;

      // Return if alt or ctrl are held ( and not bubbles can also send default TV keybinds )
      //if ((e.ctrlKey || e.altKey)) return true;

      return false;
    }

    // Don't trigger hotkeys if ctrl, alt, or focused on text input
    document.addEventListener("keydown", e => !stopPropagation(e) || e.stopPropagation(), true);
  }

  initFuzzySearch() {
    // Fuzzy search
    const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;
    textBox?.addEventListener('input', e => {
      const result = Array.from(features.keys()).filter(featureName => fuzzySearch(textBox.value, featureName));
      const featuresToInject: Feature[] = result.map(key => features.get(key)).filter(feature => feature !== undefined) as Feature[];
      this.injectFeatures(featuresToInject);
      e.stopPropagation();
    });
  }

  injectFeatures(featuresArr: Feature[]) {
    const TVContentContainer = document.getElementById('tradingview-dropdown-content-container');
    const TVPContentContainer = document.getElementById('custom-dropdown-content-container');

    // Clear prev items
    if (TVPContentContainer)
      TVPContentContainer.innerHTML = "";

    // Clear prev items
    if (TVContentContainer)
      TVContentContainer.innerHTML = "";


    // Dynamically insert features into menu
    featuresArr.forEach(feature => {
      const category = feature.getCategory();
      const p = document.createElement('p');
      p.innerText = feature.getName();

      let categoryContainer;
      switch(category) {
        case Category.TV:
          categoryContainer = TVContentContainer;
          break;
        case Category.TVP:
          categoryContainer = TVPContentContainer;
          break;
      }

      categoryContainer?.appendChild(p);
    });
  }

  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    const container = document.getElementById('tvp-menu');
    const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;

    if (!container) return;

    container.style.right = '0px';

    // This is kinda weird, but necessary otherwise there would 
    // always be an "m" in the text input whenever the menu was opened.
    // There is probably a better fix but this works for now
    setTimeout(() => {
      textBox.focus();
    }, 200);
  }

  close() {
    const container = document.getElementById('tvp-menu');
    const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;

    if (!container) return;

    container.style.right = -container.getBoundingClientRect().width+'px';
    textBox.blur();
  }

  isOpen() {
    const container = document.getElementById('tvp-menu');
    if (!container) return false;
    return container.style.right == '0px';
  }

  initResizeLogic() {
    const pos = {x: 0, y: 0};
    const container = document.getElementById('tvp-menu');
    let mouseDown = false;
    let menuContainerWidth = container?.getBoundingClientRect().width;

    // Hide menu by default
    if (container && menuContainerWidth) {
      container.style.right = -menuContainerWidth+'px';
    }

    // Menu resize logic
    document.addEventListener('mousemove', e => {pos.x = e.clientX, pos.y = e.clientY});
    const handleContainer = document.getElementById("handle-container");
    handleContainer?.addEventListener('mousedown', () => {
      console.log('mousedown')
      mouseDown = true;
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });

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
}
