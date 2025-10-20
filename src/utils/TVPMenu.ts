class TVPMenu {
  constructor() {
  }

  init() {
    this.initResizeLogic();
    this.injectFeatures(Array.from(features.values()));
    this.initFuzzySearch();
    this.initTvpBackgroundEvents();
    this.initInjectCurrentVersion();
  }

  initInjectCurrentVersion() {
    const versionElement = document.getElementById('tvp-menu-version');
    
    if (versionElement) {
      versionElement.innerText = VERSION;
    }
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

  //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  makeid(length: number) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
  }

  createFeatureHTML(feature: Feature): HTMLElement {
    const container = document.createElement('div');
    container.className = 'tvp-feature';

    function onDotsClick() {
      const menu = document.getElementById('tvp-menu');
      const dots = container.querySelector('svg');
      if (!menu || !dots || feature.getContextMenuOptions().length === 0) return;
      const x = dots.getBoundingClientRect().x - menu.getBoundingClientRect().x;
      const cm = new ContextMenu([x, dots.getBoundingClientRect().y]);
      cm.renderList(feature.getContextMenuOptions());
    }

    // Create the first <span> element
    const span1 = document.createElement('span');

    // Create the checkbox input element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = feature.isEnabled();

    // Create the <p> element
    const paragraph = document.createElement('p');
    paragraph.textContent = feature.getName();

    // Append the checkbox and paragraph to the first <span>
    span1.appendChild(checkbox);
    span1.appendChild(paragraph);

    // Create the second <span> element
    const span2 = document.createElement('span');

    // Create the <span> element with class "hotkeyLabel"
    const hotkeyLabel = document.createElement('span');
    hotkeyLabel.id = `${feature.getName()}-hotkey-label`;
    hotkeyLabel.innerHTML = DOMPurify.sanitize(this.generateHotkeyString(feature));

    // Create the button element
    const button = document.createElement('button');

    // Create the SVG string
    const svgString = `
      <svg id="${feature.getName()}-svg-dots" width="16" height="20" viewBox="0 0 16 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16ZM8 24C3.6 24 0 27.6 0 32C0 36.4 3.6 40 8 40C12.4 40 16 36.4 16 32C16 27.6 12.4 24 8 24ZM8 48C3.6 48 0 51.6 0 56C0 60.4 3.6 64 8 64C12.4 64 16 60.4 16 56C16 51.6 12.4 48 8 48Z" fill="#C7C7C7"/>
      </svg>
    `;

    // Set the innerHTML of the button to the SVG string
    button.innerHTML = DOMPurify.sanitize(svgString);

    // Append the hotkeyLabel and button to the second <span>
    span2.appendChild(hotkeyLabel);
    span2.appendChild(button);

    // Append the two <span> elements to the container
    container.appendChild(span1);
    container.appendChild(span2);

    // TODO remove event listener on destroy to avoid memory leaks
    // Context menu button
    button.addEventListener('click', () => {
      onDotsClick();
    });

    // Checkbox event listener
    checkbox.addEventListener('change', () => {
      feature.toggleEnabled();
    });

    return container;
  }

  generateHotkeyString(feature: Feature): string {
    const pretty = (k: string) => ({
      WheelUp: 'Wheel Up',
      WheelDown: 'Wheel Down',
      MouseLeft: 'Mouse Left',
      MouseMiddle: 'MMB',
      MouseRight: 'Mouse Right',
      Mouse4: 'Mouse4',
      Mouse5: 'Mouse5'
    }[k] || k);
    
    const wrapInHotkeyLabelSpan = (text: string) => {
      return `<span class="hotkeyLabel">${text}</span>`;
    };

    const altLabels = feature.getAlternateHotkeyLabels();

    if (altLabels !== null) {
      const allAltParts: string[] = [];
      altLabels.forEach(label => {
        label.split(' + ').forEach(part => {
          allAltParts.push(wrapInHotkeyLabelSpan(pretty(part.trim())));
        });
      });
      return allAltParts.join(' + ');
    }

    const parts: string[] = [];
    const hotkey = feature.getHotkey();

    if (hotkey.key == null) {
      return wrapInHotkeyLabelSpan("N/A");
    }

    if (hotkey.alt) {
      parts.push(wrapInHotkeyLabelSpan("Alt"));
    }
    if (hotkey.ctrl) {
      parts.push(wrapInHotkeyLabelSpan("Ctrl"));
    }
    if (hotkey.shift) {
      parts.push(wrapInHotkeyLabelSpan("Shift"));
    }
    if (hotkey.meta) {
      parts.push(wrapInHotkeyLabelSpan("Meta"));
    }

    if (typeof hotkey.key === 'string' && hotkey.key.includes(' + ')) {
      hotkey.key.split(' + ').forEach(keyPart => {
        parts.push(wrapInHotkeyLabelSpan(pretty(keyPart.trim())));
      });
    } else {
      parts.push(wrapInHotkeyLabelSpan(pretty(hotkey.key as string)));
    }

    return parts.join(' + ');
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
      const featureHTML = this.createFeatureHTML(feature);

      let categoryContainer;
      switch(category) {
        case Category.TV:
          categoryContainer = TVContentContainer;
          break;
        case Category.TVP:
          categoryContainer = TVPContentContainer;
          break;
      }

      categoryContainer?.appendChild(featureHTML);
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
    this.revealBackground();

    // Open menu
    const container = document.getElementById('tvp-menu');
    const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;

    if (!container) return;

    // If light mode, change menu background color
    if (isLightMode())
      container.classList.add('tvp-light');
    else
      if (container.classList.contains('tvp-light'))
        container.classList.remove('tvp-light');


    // Unhide menu
    container.style.left = '0px';

    // This is kinda weird, but necessary otherwise there would 
    // always be an "m" in the text input whenever the menu was opened.
    // There is probably a better fix but this works for now
    setTimeout(() => {
      textBox.focus();
    }, 200);
  }

  revealBackground() {
    // Reveal background
    const background = document.getElementById('tvp-background');
    if (background) {
      background.style.opacity = '0.3';
      background.style.pointerEvents = 'initial';
    }
  }

  hideBackground() {
    // Hide background
    const background = document.getElementById('tvp-background');
    if (background) {
      background.style.opacity = '0';
      background.style.pointerEvents = 'none';
    }
  }

  close() {
    this.hideBackground();

    // Close menu
    const container = document.getElementById('tvp-menu');
    const textBox: HTMLInputElement = document.querySelector('[id="tvp-menu"] input') as HTMLInputElement;

    if (!container) return;

    container.style.left = -container.getBoundingClientRect().width+'px';
    textBox.blur();
  }

  isOpen() {
    const container = document.getElementById('tvp-menu');
    if (!container) return false;
    return container.style.left == '0px';
  }

  initTvpBackgroundEvents() {
    const background = document.getElementById('tvp-background');
    if (background) {
      background.addEventListener('click', () => {
        this.close();
      })
    }
  }

  initResizeLogic() {
    const pos = {x: 0, y: 0};
    const container = document.getElementById('tvp-menu');
    let mouseDown = false;
    let menuContainerWidth = container?.getBoundingClientRect().width;

    // Hide menu by default
    if (container && menuContainerWidth) {
      container.style.left = -menuContainerWidth+'px';
    }

    // Menu resize logic
    document.addEventListener('mousemove', e => {pos.x = e.clientX, pos.y = e.clientY});
    const handleContainer = document.getElementById("tvp-menu-handle-container");
    handleContainer?.addEventListener('mousedown', () => {
      mouseDown = true;
    });

    document.addEventListener('mouseup', () => {
      mouseDown = false;
    });

    document.addEventListener('mousemove', e => {
      if (mouseDown && container) {
        menuContainerWidth = e.clientX;
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
