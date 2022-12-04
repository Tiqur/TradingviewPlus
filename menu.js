
// This code is shit, but no one will see it right?? :eyes:

let listenForHotkey = false;
let hotkey = null;
let hotkeyCache = null;
let featureCache = null;

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


let menu = {
  'Features': {
    'Auto Timeframe Colors': {
      'tooltip': 'Automatically changes tool color on click',
      'enabled': true,
      'hotkey': ['s']
    },
    'Change Line Style': {
      'tooltip': 'Scrolls line styles ( solid, dashed, dotted )',
      'enabled': true,
      'hotkey': ['q']
    },
    'Change Line Width': {
      'tooltip': 'Scrolls line width ( 1px, 2px, 3px, 4px )',
      'enabled': true,
      'hotkey': ['w']
    },
    'Toggle Auto Scale': {
      'tooltip': 'Toggles the chart\'s "Auto" scale',
      'enabled': true,
      'hotkey': ['a']
    },
    'Toggle Invert Scale': {
      'tooltip': 'Toggles the inversion of the price axis',
      'enabled': true,
      'hotkey': ['e']
    },
    'Toggle Replay Mode': {
      'tooltip': 'Toggles replay mode ( must have pro plan or higher )',
      'enabled': true,
      'hotkey': ['t']
    },
    'Copy Price At Ticker': {
      'tooltip': 'Copies price at cursor position',
      'enabled': true,
      'hotkey': ['c']
    },
    'Delete Drawing': {
      'tooltip': 'Deletes currently selected drawing',
      'enabled': true,
      'hotkey': ['d']
    },
    'Scroll To Most Recent Bar': {
      'tooltip': 'Scrolls to to most recent candle',
      'enabled': true,
      'hotkey': ['f']
    },
    'Scroll time left': {
      'tooltip': 'Scrolls backward in time',
      'enabled': true,
      'hotkey': ['x']
    },
    'Scroll time right': {
      'tooltip': 'Scrolls forward in time',
      'enabled': true,
      'hotkey': ['x']
    },
    'Scroll Timeframes': {
      'tooltip': 'Allows you to scroll through timeframes using a hotkey + the scroll wheel',
      'enabled': true,
      'hotkey': ['Tab']
    },
    'Scroll Price Scale': {
      'tooltip': 'Allows you to scroll the price scale using a hotkey + the scroll wheel',
      'enabled': true,
      'hotkey': ['Shift']
    },
    'Zoom Both Axes': {
      'tooltip': 'Zooms both time and pice axes at the same time',
      'enabled': true,
      'hotkey': ['Shift', 'Ctrl']
    },
    'Ad-Blocker ( under development )': {
      'tooltip': 'Blocks Ads + Pop-Ups',
      'enabled': false,
      'hotkey': null
    },
  },
  'Display': {

  },
  'Settings': {

  }
}


let menuContainerWidth = 400;

const container = document.createElement('div');
container.id = 'menu-container';
container.style.height = '100vh';
container.style.width = menuContainerWidth+'px';
container.style.background = '#151924';
container.style.position = 'fixed';
container.style.right = '0';
container.style.display = 'none';
container.style.borderLeft = '0.5px solid #2a2e39';


const controlDiv = document.createElement('div');
controlDiv.style.width = '2em';
controlDiv.style.height = '100vh';
controlDiv.style.display = 'flex';
controlDiv.style.justifyContent = 'center';
controlDiv.style.alignItems = 'center';
controlDiv.style.background = '#151924';
container.appendChild(controlDiv);

const controlDivBar = document.createElement('div');
controlDivBar.style.background = '#787b86';
controlDivBar.style.width = '4px';
controlDivBar.style.height = '76px';
controlDivBar.style.borderRadius = '3px';
controlDiv.appendChild(controlDivBar);
controlDivBar.addEventListener('mouseover', () => controlDivBar.style.background = '#9598a1');
controlDivBar.addEventListener('mouseout', () => controlDivBar.style.background = '#787b86');

controlDiv.addEventListener('mouseover', () => controlDiv.style.cursor = 'col-resize');
controlDiv.addEventListener('mouseout', () => controlDiv.style.cursor = 'initial');

let mouseDown = false;

controlDiv.addEventListener('mousedown', e => {
  mouseDown = true;
})

document.addEventListener('mouseup', e => {
  mouseDown = false;
})

document.addEventListener('mousemove', e => {
  if (mouseDown) {
    menuContainerWidth = window.innerWidth - e.clientX;
    if (menuContainerWidth > 400 && menuContainerWidth < window.innerWidth) {
      container.style.width = menuContainerWidth+'px';
    } else {
      menuContainerWidth = menuContainerWidth < 400 ? 400 : window.innerWidth;
      container.style.width = menuContainerWidth+'px';
    }
  }
});



const margin = document.createElement('div');
margin.style.background = '#151924';
margin.style.width = '100%';
margin.style.height = '100vh';
margin.style.display = 'flex';
margin.style.flexDirection = 'column';
margin.style.alignItems = 'center';
container.appendChild(margin);

//const closeDiv = document.createElement('div');
//container.appendChild(closeDiv);

const contentTitle = document.createElement('div');
contentTitle.style.background = '#151924';
contentTitle.style.width = '80%';
contentTitle.style.height = '4em';
contentTitle.style.display = 'flex';
contentTitle.style.alignItems = 'center';
contentTitle.style.justifyContent = 'center';
contentTitle.style.padding = '1em';
const title = document.createElement('h');
title.innerHTML = 'TradingviewPlus';
title.style.fontSize = '30px';
title.style.color = 'white';
contentTitle.appendChild(title);
margin.appendChild(contentTitle);

const tooltipContainer = document.createElement('div');
tooltipContainer.style.background = '#434651';
tooltipContainer.style.border = '0.5px solid #787b86'
tooltipContainer.style.padding = '0.8em';
tooltipContainer.style.borderRadius = '6px';
tooltipContainer.style.position = 'absolute';
tooltipContainer.style.display = 'flex';
tooltipContainer.style.justifyContent = 'center';
tooltipContainer.style.alignItems = 'center';
tooltipContainer.style.width = '200px';
tooltipContainer.style.wordWrap = 'break-word';

const contentBody = document.createElement('div');
contentBody.style.background = '#151924';
contentBody.style.width = '80%';
contentBody.style.height = '100%';
contentBody.style.overflowY = 'hidden';
margin.appendChild(contentBody);

// Create dropdowns
Object.keys(menu).forEach((e, i) => {
  const container = document.createElement('div');
  container.style.height = '5em';
  container.style.width = '100%';
  container.style.borderRadius = '6px';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  if (i < Object.keys(menu).length-1)
    container.style.borderBottom = '0.5px solid #2a2e39';
  container.addEventListener('mouseover', () => {container.style.background = '#2a2e39'; container.style.cursor = 'pointer'});
  container.addEventListener('mouseout', () => {container.style.background = '#151924'; container.style.cursor = 'initial'});

  const containerTitle = document.createElement('p');
  containerTitle.innerHTML = e;
  containerTitle.style.fontSize = '20px';
  containerTitle.style.marginLeft = '1em';
  container.appendChild(containerTitle);




  const dropdownContent = document.createElement('div');
  dropdownContent.style.width = '100%';
  dropdownContent.style.display = 'none';
  dropdownContent.style.flexDirection = 'column';

  container.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'none' ? 'flex' : 'none';
  });

  Object.keys(menu[Object.keys(menu)[i]]).forEach(feature => {
    switch (Object.keys(menu)[i]) {
      case 'Features':
        const featureCheckBox = document.createElement('div');
        const enabled = menu['Features'][feature].enabled;
        const svgString = `<svg fill='white' xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"><path d="M9 22l-10-10.598 2.798-2.859 7.149 7.473 13.144-14.016 2.909 2.806z"/></svg>`;
        featureCheckBox.id = menu['Features'][feature].enabled ? 'feature-checkbox-filled' : 'feature-checkbox';
        featureCheckBox.innerHTML = enabled ? svgString : '';
        featureCheckBox.style.background = enabled ? '#2962ff' : '';

        featureCheckBox.style.marginRight = '0.5em';
        featureCheckBox.style.display = 'flex';
        featureCheckBox.style.justifyContent = 'center';
        featureCheckBox.style.alignItems = 'center';
        featureCheckBox.style.width = '18px';
        featureCheckBox.style.height = '18px';
        featureCheckBox.style.borderRadius = '6px';
        featureCheckBox.style.border = `0.5px solid ${enabled ? '#2962ff' : '#787b76'}`;

        featureCheckBox.addEventListener('mouseover', () => {featureCheckBox.style.border = '0.5px solid #9598a1'; featureCheckBox.style.cursor = 'pointer'});
        featureCheckBox.addEventListener('mouseout', () => {featureCheckBox.style.border = `0.5px solid ${menu['Features'][feature].enabled ? '#2962ff' : '#787b76'}`; featureCheckBox.style.cursor = 'initial'});

        // On checkbox click
        featureCheckBox.addEventListener('click', e => {
          menu['Features'][feature].enabled = !menu['Features'][feature].enabled;
          featureCheckBox.id = menu['Features'][feature].enabled ? 'feature-checkbox-filled' : 'feature-checkbox';
          featureCheckBox.innerHTML = menu['Features'][feature].enabled ? svgString : '';
          featureCheckBox.style.background = menu['Features'][feature].enabled ? '#2962ff' : '';
        });

        // Checkbox
        const featureCheckBoxDiv = document.createElement('div');
        
        
        const hk = menu['Features'][feature].hotkey;
        const hotkeyDiv = document.createElement('div');
        hotkeyDiv.style.display = 'flex';
        hotkeyDiv.style.justifyContent = 'center';
        hotkeyDiv.style.alignItems = 'center';
        hotkeyDiv.style.minWidth = '34px';
        hotkeyDiv.style.height = '34px';
        hotkeyDiv.style.border = '1px solid #434651';
        hotkeyDiv.style.borderRadius = '6px';
        hotkeyDiv.style.boxShadow = '0 2px 0 #434651';

        hotkeyDiv.addEventListener('mouseover', () => {hotkeyDiv.style.background = '#2962ff'; hotkeyDiv.style.cursor = 'pointer'});
        hotkeyDiv.addEventListener('mouseout', () => {hotkeyDiv.style.background = 'initial'; hotkeyDiv.style.cursor = 'initial'});
        hotkeyDiv.addEventListener('click', e => {
          console.log('Listening for hotkeys...')
          hotkey = menu['Features'][feature].hotkey;
          setTimeout(() => {
            listenForHotkey = true;
          }, 0);
          hotkeyDiv.innerHTML = '...';
          hotkeyCache = hotkeyDiv;
          featureCache = feature;
        });


        if (hk != null) {
          hotkeyDiv.innerHTML = hk.join(' + ');

          // Pad if necessary
          if (hk.length > 1 || hk[0].length > 1)
            hotkeyDiv.style.padding = '0 1em';
        }


        const priceCheckboxContainer = document.createElement('div');
        priceCheckboxContainer.style.display = 'flex';
        priceCheckboxContainer.style.alignItems = 'center';

        priceCheckboxContainer.style.flexDirection = 'row-reverse';

        featureCheckBoxDiv.appendChild(hotkeyDiv);
        const featureTitle = document.createElement('p');
        featureTitle.innerHTML = feature + questionMarkSvgString;

        // Tooltip logic
        featureTitle.querySelector('svg').addEventListener('mouseover', e => {
          tooltipContainer.style.display = 'flex';
          tooltipContainer.innerHTML = menu['Features'][feature].tooltip;
          tooltipContainer.style.left = e.clientX + 'px';
          tooltipContainer.style.top = e.clientY - tooltipContainer.getBoundingClientRect().height + 'px';
          
        })
        featureTitle.querySelector('svg').addEventListener('mouseout', () => {
          tooltipContainer.style.left = '0';
          tooltipContainer.style.top = '0';
          tooltipContainer.style.display = 'none';
          tooltipContainer.innerHTML = '';
        })

        priceCheckboxContainer.appendChild(featureTitle);
        featureCheckBoxDiv.style.display = 'flex';
        featureCheckBoxDiv.style.justifyContent = 'space-between';
        featureCheckBoxDiv.style.marginLeft = '1em';
        featureCheckBoxDiv.style.flexDirection = 'row-reverse';
        featureCheckBoxDiv.style.padding = '0.5em 0';

        priceCheckboxContainer.appendChild(featureCheckBox)
        featureCheckBoxDiv.appendChild(priceCheckboxContainer)
        dropdownContent.appendChild(featureCheckBoxDiv)

        break;
      case 'Display':

        break;
      case 'Settings':

        break;
    }
  });

  contentBody.appendChild(container);
  contentBody.appendChild(dropdownContent);
});


waitForElm('#overlap-manager-root').then(() => {
  document.getElementById('overlap-manager-root').appendChild(container);
  document.getElementById('overlap-manager-root').appendChild(tooltipContainer)
})

function setHotkey(feature, keys) {
  console.log(keys, feature)
  hotkeyCache.innerHTML = keys.join(' + ');

  // Pad if necessary
  if (keys.length > 1 || keys[0].length > 1)
    hotkeyCache.style.padding = '0 1em';
  else 
    hotkeyCache.style.padding = '0';
  
  // Set hotkey in config
  menu['Features'][featureCache].hotkey = keys;
}

// Listen for hotkey
document.addEventListener('keydown', e => {
  if (listenForHotkey)
    hotkey = e;
});

// Set hotkey
document.addEventListener('keyup', e => {
  if (hotkey && e.key === hotkey.key && listenForHotkey) {
    const ctrl = hotkey.ctrlKey;
    const alt = hotkey.altKey;
    const shift = hotkey.shiftKey;
    const key = hotkey.key;
    listenForHotkey = false;
    let k = [];
    if (ctrl) k.push('Control');
    if (shift) k.push('Shift');
    if (alt) k.push('Alt');
    if (key != 'Control' && key != 'Shift' && key != 'Alt') k.push(key);
    setHotkey(featureCache, k);
  }

});

document.addEventListener('click', e => {
  if (listenForHotkey) {
    setHotkey(featureCache, hotkey);
    listenForHotkey = false;
  }
});

waitForElm('#tvp-custom-button').then(() => {
  document.getElementById('tvp-custom-button').addEventListener('click', e => {
    if (container.className.includes('open')) {
      container.className = '';
      container.style.display = 'none';
    } else {
      container.className = 'menu-container-open';
      container.style.display = 'flex';
    }
  })
});
