// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}


const config = {
  '1m': 0,
  '3m': 49,
  '5m': 11,
  '15m': 13,
  '1h': 15,
  '4h': 12,
  'D': 10,
  'W': 17,
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
//innerDiv.setAttribute('style', getInnerDivStyle(active));
customButton.appendChild(innerDiv)

// Set svg
innerDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg>'

// Hover effects
customButton.addEventListener('mouseenter', () => innerDiv.setAttribute('style', getInnerDivStyle(active, true)));
customButton.addEventListener('mouseleave', () => innerDiv.setAttribute('style', getInnerDivStyle(active, false)));

// On click
customButton.addEventListener('click', () => {active = !active; innerDiv.setAttribute('style', getInnerDivStyle(active, true))})

// Inject custom button to toolbar
waitForElm('#drawing-toolbar').then(() => {
  document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[2].children[0].insertAdjacentElement('beforebegin', customButton)
})





// Wait for chart to exist
waitForElm('.chart-gui-wrapper').then(async (e) => {
  // On canvas click
  document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', () => {
    if (!active) return;

    // Get current timeframe
    const currentTimeframe = [].slice.call(document.querySelector('[id="header-toolbar-intervals"]').children).filter(e => e.className.includes('isActive'))[0].innerText;

    // Wait for toolbar
    waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
      // Click Line tool colors on toolbar
      document.getElementsByClassName('floating-toolbar-react-widgets__button')[1].click()
      const colorBox = document.querySelector('[data-name="menu-inner"]').children[0];
      const allColors = [...[].slice.call(colorBox.children[0].children), ...[].slice.call(colorBox.children[1].children)];
      allColors[config[currentTimeframe]].click();
      console.log(currentTimeframe)
    })
  });
})
