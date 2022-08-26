// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Timeframe and color positions
let timeframeConfig = new Map();

// All default tradingview colors
const defaultColors = ["rgb(255, 255, 255)","rgb(209, 212, 220)","rgb(178, 181, 190)","rgb(149, 152, 161)","rgb(120, 123, 134)","rgb(93, 96, 107)","rgb(67, 70, 81)","rgb(42, 46, 57)","rgb(19, 23, 34)","rgb(0, 0, 0)","rgb(242, 54, 69)","rgb(255, 152, 0)","rgb(255, 235, 59)","rgb(76, 175, 80)","rgb(8, 153, 129)","rgb(0, 188, 212)","rgb(41, 98, 255)","rgb(103, 58, 183)","rgb(156, 39, 176)","rgb(233, 30, 99)","rgb(252, 203, 205)","rgb(255, 224, 178)","rgb(255, 249, 196)","rgb(200, 230, 201)","rgb(172, 229, 220)","rgb(178, 235, 242)","rgb(187, 217, 251)","rgb(209, 196, 233)","rgb(225, 190, 231)","rgb(248, 187, 208)","rgb(250, 161, 164)","rgb(255, 204, 128)","rgb(255, 245, 157)","rgb(165, 214, 167)","rgb(112, 204, 189)","rgb(128, 222, 234)","rgb(144, 191, 249)","rgb(179, 157, 219)","rgb(206, 147, 216)","rgb(244, 143, 177)","rgb(247, 124, 128)","rgb(255, 183, 77)","rgb(255, 241, 118)","rgb(129, 199, 132)","rgb(66, 189, 168)","rgb(77, 208, 225)","rgb(91, 156, 246)","rgb(149, 117, 205)","rgb(186, 104, 200)","rgb(240, 98, 146)","rgb(247, 82, 95)","rgb(255, 167, 38)","rgb(255, 238, 88)","rgb(102, 187, 106)","rgb(34, 171, 148)","rgb(38, 198, 218)","rgb(49, 121, 245)","rgb(126, 87, 194)","rgb(171, 71, 188)","rgb(236, 64, 122)","rgb(178, 40, 51)","rgb(245, 124, 0)","rgb(251, 192, 45)","rgb(56, 142, 60)","rgb(5, 102, 86)","rgb(0, 151, 167)","rgb(24, 72, 204)","rgb(81, 45, 168)","rgb(123, 31, 162)","rgb(194, 24, 91)","rgb(128, 25, 34)","rgb(230, 81, 0)","rgb(245, 127, 23)","rgb(27, 94, 32)","rgb(0, 51, 42)","rgb(0, 96, 100)","rgb(12, 50, 153)","rgb(49, 27, 146)","rgb(74, 20, 140)","rgb(136, 14, 79)"]

// Selected timeframe
let selectedTimeframe = '';

// Arrow button active
let arrowActive = true;

// Shift key down ( for timeframe scrolling )
let leftShiftDown = false;

// Handle shift down event
const handleLeftShiftKeyEvent = (e, a) => {
  if (e.code === "ShiftLeft") leftShiftDown = a;
}


// Waits for element to load 
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


// Button is active
let active = true;

// Generate style for inner div style
function getInnerDivStyle(active, hover) {
  const divSize = active ? 30 : 33;
  const backgroundColor = active ? hover ? '#1e53e5' : '#2962ff' : hover ? '#2a2e39' : 'none';
  return `background-color: ${backgroundColor}; width: ${divSize}px; height: ${divSize}px; display: flex; justify-content: center; align-items: center; border-radius: 4px;`;
}

// Create Button
const customButton = document.createElement('div');
customButton.setAttribute(
  'style',
  'color: #b2b5be; width: auto; height: 36px; display: flex; justify-content: center; align-items: center;'
);

// Div inside button
const innerDiv = document.createElement('div');
innerDiv.setAttribute('style', getInnerDivStyle(active));
customButton.appendChild(innerDiv)

// Set svg
innerDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg>'

// Hover effects
customButton.addEventListener('mouseenter', () => innerDiv.setAttribute('style', getInnerDivStyle(active, true)));
customButton.addEventListener('mouseleave', () => innerDiv.setAttribute('style', getInnerDivStyle(active, false)));

// On click
innerDiv.addEventListener('click', () => {active = !active; innerDiv.setAttribute('style', getInnerDivStyle(active, true))})

// Inject custom button to toolbar
waitForElm('#drawing-toolbar').then(() => {
  document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[2].children[0].insertAdjacentElement('beforebegin', customButton)
  
  // Initialize 'overlap-manager-root' ( side arrow menu )
  document.querySelector('[data-role="menu-handle"]').click();
  document.querySelector('[data-role="menu-handle"]').click();

  // Button Arrow
  const buttonArrow = document.createElement('div');
  const style = `position: absolute; right: 0; border-radius: 3px 0 0 3px; display: flex; justify-content: center; align-items: center; width: 11px; height: 33px;`;
  buttonArrow.setAttribute('style', style);
  buttonArrow.innerHTML = '<svg style="width: 7px; height: 7px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"></path></svg>'
  buttonArrow.addEventListener('mouseenter', () => buttonArrow.setAttribute('style', style + 'background: #2a2e39; fill: #787b86; cursor: pointer;'));
  buttonArrow.addEventListener('mouseleave', () => buttonArrow.setAttribute('style', style + 'fill: none;'));
  buttonArrow.addEventListener('click', () => {arrowActive ? renderConfigMenu() : configMenu.remove(); colorPicker.remove(); arrowActive = !arrowActive;});
  customButton.appendChild(buttonArrow);
})





// Create Config Menu
const configMenu = document.createElement('div');
function renderConfigMenu() {
  configMenu.innerHTML = '';
  configMenu.setAttribute('style', `position: fixed; border-radius: 3px; background: #1e222d; width: auto; height: auto; z-index: 500; top: ${document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[2].children[0].getBoundingClientRect().top}px; left: 53px;`);
  document.getElementById('overlap-manager-root').appendChild(configMenu);

  // Render each timeframe
  [].slice.call(document.querySelector('[id="header-toolbar-intervals"]').children).slice(0, -1).forEach(e => {
    const timeframe = e.innerText;
    if (!timeframeConfig.has(timeframe)) {
      timeframeConfig.set(timeframe, 0);
    }

    // Outer config element div
    const colorConfigElement = document.createElement('div');
    const style = 'width: auto; height: auto; padding: 10px; display: flex; flex-direction: row-reverse; justify-content: flex-end; align-items: center;';
    colorConfigElement.setAttribute('style', style);

    // Colored div representing current value
    const colorConfigPreview = document.createElement('div');
    colorConfigPreview.setAttribute('style', `width: 22px; margin-right: 8px; height: 22px; background: ${defaultColors[timeframeConfig.get(timeframe)]};`);

    // Config element div mouse events
    colorConfigElement.addEventListener('mouseenter', () => colorConfigElement.setAttribute('style', style + ' background: #2a2e39;'));
    colorConfigElement.addEventListener('mouseleave', () => colorConfigElement.setAttribute('style', style));
    colorConfigElement.addEventListener('click', () => {selectedTimeframe = timeframe; renderColorPicker()});

    // Inject into config element
    colorConfigElement.innerHTML = `<p>${timeframe}</p>`;
    colorConfigElement.appendChild(colorConfigPreview);
    
    // Inject into configMenu
    configMenu.appendChild(colorConfigElement);
  })
}





// Render color picker
const colorPicker = document.createElement('div');
function renderColorPicker() {
  colorPicker.innerHTML = '';
  colorPicker.setAttribute('style', `position: fixed; border-radius: 3px; background: #1e222d; padding: 8px; width: auto; height: auto; z-index: 501; display: flex; flex-direction: column; top: ${document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[2].children[0].getBoundingClientRect().top}px; left: ${53 + 2 +  configMenu.getBoundingClientRect().width}px;`);
  document.getElementById('overlap-manager-root').appendChild(colorPicker);


  // Render each color
  for (i=0; i<8; i++) {
    const colorContainer = document.createElement('div');
    colorContainer.setAttribute('style', `width: auto; height: auto; display: flex; ${i === 1 ? 'margin-bottom: 6px;' : ''} `);
    for (o=0; o<10; o++) {
      const index = o+i*10;
      const color = document.createElement('div');
      const style = `width: 18px; height: 18px; background: ${defaultColors[index]}; margin: 3px; border-radius: 3px;`;
      color.setAttribute('style', style);
      color.addEventListener('mouseenter', () => color.setAttribute('style', style + 'cursor: pointer;'));
      color.addEventListener('mouseleave', () => color.setAttribute('style', style));
      color.addEventListener('click', async () => {
        // Close color picker
        colorPicker.remove()

        // Set color
        timeframeConfig.set(selectedTimeframe, index);
        configMenu.remove();
        renderConfigMenu();

        // Set local storage
        await browser.storage.local.set({"localConfig": JSON.stringify(Object.fromEntries(timeframeConfig))})
      });
      colorContainer.appendChild(color);
    }
    colorPicker.appendChild(colorContainer);
  }
}





// Allow scrolling of timeframes with leftshift and scroll wheel
document.addEventListener('keydown', e => handleLeftShiftKeyEvent(e, true))
document.addEventListener('keyup', e => handleLeftShiftKeyEvent(e, false))
document.addEventListener('wheel', e => {
  if (!leftShiftDown) return;
  const timeframeButtons = [].slice.call(document.querySelector('[id="header-toolbar-intervals"]').children)
  const currentTimeframe = timeframeButtons.filter(e => e.className.includes('isActive'))[0].innerText;
  const direction = e.deltaY < 0 ? 'up' : 'down';
  const currentTimeframeIndex = timeframeButtons.map(e => e.className.includes('isActive')).indexOf(true);
  const newTimeframeIndex = currentTimeframeIndex + (e.deltaY < 0 ? -1 : 1);
  if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length-1) {
    timeframeButtons[newTimeframeIndex].click();
  } 
})




// Wait for chart to exist
waitForElm('.chart-gui-wrapper').then(async (e) => {
  // Set config if saved locally
  const localConfig = await browser.storage.local.get('localConfig');
  if (Object.keys(localConfig).length > 0) timeframeConfig = new Map(Object.entries(JSON.parse(localConfig['localConfig'])));

  // On canvas click
  document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', async () => {

    // Close menus
    arrowActive = true;
    colorPicker.remove();
    configMenu.remove();

    if (!active) return;

    // Get current timeframe
    const currentTimeframe = [].slice.call(document.querySelector('[id="header-toolbar-intervals"]').children).filter(e => e.className.includes('isActive'))[0].innerText;

    // Wait for toolbar
    waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
      // Click Line tool colors on toolbar
      document.getElementsByClassName('floating-toolbar-react-widgets__button')[1].click()
      const colorBox = document.querySelector('[data-name="menu-inner"]').children[0];
      const allColors = [...[].slice.call(colorBox.children[0].children), ...[].slice.call(colorBox.children[1].children)];
      allColors[timeframeConfig.get(currentTimeframe)].click();
    })
  });
})
