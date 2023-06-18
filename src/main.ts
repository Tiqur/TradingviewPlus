// hmmmm
declare const chrome: any;

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

interface Feature {
  name: string;
  tooltip: string;
  enabled: boolean;
  hotkey: Hotkey | null;
  action: Function;
  category: 'Features' | 'Display' | 'Settings';
}


interface Hotkey {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
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

const questionMarkSvgString = `
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 fill='white' width="12px" height="12px" viewBox="0 0 40.124 40.124" style="enable-background:new 0 0 40.124 40.124;"
	 xml:space="preserve">
  <g>
    <g>
      <path d="M19.938,12.141c1.856,0,2.971,0.99,2.971,2.66c0,3.033-5.414,3.869-5.414,7.55c0,0.99,0.648,2.072,1.979,2.072
        c2.042,0,1.795-1.516,2.538-2.6c0.989-1.453,5.6-3,5.6-7.023c0-4.361-3.897-6.188-7.858-6.188c-3.773,0-7.24,2.692-7.24,5.725
        c0,1.237,0.929,1.887,2.012,1.887C17.525,16.225,15.979,12.141,19.938,12.141z"/>
      <path d="M22.135,28.973c0-1.393-1.145-2.537-2.537-2.537s-2.537,1.146-2.537,2.537c0,1.393,1.145,2.537,2.537,2.537
        S22.135,30.366,22.135,28.973z"/>
      <path d="M40.124,20.062C40.124,9,31.124,0,20.062,0S0,9,0,20.062s9,20.062,20.062,20.062S40.124,31.125,40.124,20.062z M2,20.062
        C2,10.103,10.103,2,20.062,2c9.959,0,18.062,8.103,18.062,18.062c0,9.959-8.103,18.062-18.062,18.062
        C10.103,38.124,2,30.021,2,20.062z"/>
    </g>
  </g>
</svg>`;

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


function createHotkeyInput(default_hotkey: string[] | null) {
  const hotkey_input_container = document.createElement('hotkey-input');
  hotkey_input_container.className = 'tvp-hotkey-input-container'
  hotkey_input_container.innerText = default_hotkey ? default_hotkey.join(' ') : 'null';

  return hotkey_input_container;
}

function createMenuItem(value: Feature) {
  const content_container = document.createElement('div');

  const left_container = document.createElement('div');

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = value.enabled;
  left_container.appendChild(input);

  const node = document.createElement('p');
  node.innerHTML = value.name + questionMarkSvgString;
  left_container.appendChild(node);
  content_container.appendChild(left_container);

  const hotkey_input = createHotkeyInput(value.hotkey);
  content_container.appendChild(hotkey_input);

  return content_container;
}


(async () => {
  fetch(browser.runtime.getURL('public/menu.html')).then(r => r.text()).then(async html => {
    document.body.insertAdjacentHTML('beforeend', html);
    await waitForElm('[id="tvp-resize-bar"]');
    initMenuResizeLogic();

    // Dynamically insert content and categoriesc
    for (const key in menu_contents) {
      const value = menu_contents[key];
      const category = value.category;

      let parent;
      parent = document.querySelector(`[id="tvp-${value.category}"]`);

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
      category_content = document.querySelector(`[id="tvp-${value.category}-content"]`);

      if (category_content == null) {
        const category_content_container = document.createElement('div');
        category_content_container.id = `tvp-${value.category}-content`;
        category_content_container.className = `tvp-category-content`;
        parent?.appendChild(category_content_container);
        category_content_container.style.display = 'none';
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
})();

