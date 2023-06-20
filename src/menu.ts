function isLightMode(): boolean {
  return document.querySelector('[class*="theme-light"]') != null;
}

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

function createHotkeyInput(default_hotkey: Hotkey | null) {
  const hotkey_input_container = document.createElement('hotkey-input');
  const hotkey_string = 
      default_hotkey?.key || ""
    + default_hotkey?.alt || ""
    + default_hotkey?.ctrl || ""
    + default_hotkey?.shift || ""
    + default_hotkey?.meta || "";

  hotkey_input_container.className = 'tvp-hotkey-input-container'
  hotkey_input_container.innerText = default_hotkey ? hotkey_string : 'null';

  return hotkey_input_container;
}

function createMenuItem(value: FeatureClass) {
  const content_container = document.createElement('div');

  const left_container = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = value.isEnabled();
  left_container.appendChild(input);

  input.addEventListener('click', e => {
    input.checked ? value.enable() : value.disable();
  });

  const node = document.createElement('p');
  node.innerHTML = value.getName() + questionMarkSvgString;
  left_container.appendChild(node);
  content_container.appendChild(left_container);

  const hotkey_input = createHotkeyInput(value.getHotkey());
  content_container.appendChild(hotkey_input);

  return content_container;
}

function injectSideMenu() {
  // Inject side menu
  fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
    document.body.insertAdjacentHTML('beforeend', html);

    await waitForElm('[id="tvp-resize-bar"]');
    initMenuResizeLogic();

    // Set to light theme if necessary
    if (isLightMode())
      (document.getElementById('tvp-menu') as HTMLElement).style.background = '#ffffff';


    // Dynamically insert content and categoriesc
    for (const key in features) {
      const value = features[key];
      const category = value.getCategory();

      let parent;
      parent = document.querySelector(`[id="tvp-${category}"]`);

      if (parent == null) {
        parent = document.createElement('div');
        parent.id = `tvp-${category}`;
        parent.setAttribute('collapsed', 'true');
        parent.className = `tvp-menu-category`;
        const h = document.createElement('h2');
        h.innerText = category;
        parent.appendChild(h);
        parent.appendChild(document.createElement('hr'))
        document.getElementById('tvp-menu-content')?.insertAdjacentElement('beforeend', parent);
      }

      let category_content;
      category_content = document.querySelector(`[id="tvp-${category}-content"]`);

      if (category_content == null) {
        category_content = document.createElement('div');
        category_content.id = `tvp-${category}-content`;
        category_content.className = `tvp-category-content`;
        parent?.appendChild(category_content);
        category_content.style.display = 'none';
      }

      const menu_item = createMenuItem(value);
      category_content?.appendChild(menu_item);
    }

    // Dropdown collapse logic
    const categories = document.querySelectorAll('.tvp-menu-category');
    categories?.forEach(category => {
      category.children[0].addEventListener('click', () => {
        const collapsed = category.getAttribute('collapsed') === 'true';
        category.setAttribute('collapsed', `${!collapsed}`);

        // Toggle collapse
        (category.children[2] as HTMLElement).style.display = !collapsed ? 'none' : 'initial';
      });
    });

  });
}
