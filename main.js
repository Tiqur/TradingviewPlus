// Timeframe and color positions
const timeframeColors = {
  "1m":  "9",
  "3m":  "8",
  "5m":  "7",
  "15m": "6",
  "1h":  "5",
  "4h":  "4",
  "D":   "3",
  "W":   "2",
  "M":   "1",
  "Y":   "0"
}

const enabledOnStartup = true;
const injectToggleButton = true;

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


// Addon
const init = () => {
  // Wrapper for toggleable tools ( magnet, etc )
  const toolWrapper = document.getElementsByClassName("group-3e32hIe9")[2].children[0];

  // Only inject if doesn't exist
  if (!document.getElementsByClassName('autoTimeframe')[0]) {
    // Create new element
    let newElement = document.createElement('div');
    newElement.className = `button-G7o5fBfa ${enabledOnStartup ? 'isActive-G7o5fBfa ' : ''} autoTimeframe`;
    newElement.innerHTML = '<div class="bg-G7o5fBfa"><span class="icon-G7o5fBfa"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg></span></div>';
    toolWrapper.insertAdjacentElement('beforebegin', newElement);
    
    // Add event listener
    newElement.addEventListener('click', () => {
      newElement.className = `button-G7o5fBfa ${newElement.className.includes('isActive') ? '' : 'isActive-G7o5fBfa'} autoTimeframe`;
    })
  }


  document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', () => {
    let currentTimeframe = [].slice.call(document.getElementById("header-toolbar-intervals").children).filter(e => e.className.includes("isActive"))[0].innerText;
    const drawingToolsActive = document.getElementsByClassName("floating-toolbar-react-widgets__button button-khcLBZEz apply-common-tooltip newStyles-khcLBZEz")[1].title == "Line tool colors";
    
    // If drawing tools is open ( opens after line click ) and autoTimeframe is enabled
    if (drawingToolsActive && document.getElementsByClassName('autoTimeframe')[0].className.includes('isActive')) {
      // Click line tool color picker
      document.getElementsByClassName("floating-toolbar-react-widgets__button button-khcLBZEz apply-common-tooltip newStyles-khcLBZEz")[1].click()

      // Click color according to timeframe 
      document.getElementsByClassName("swatches-qgksmXjR")[2].children[timeframeColors[currentTimeframe]].click()
    }

  });
}

waitForElm('.group-3e32hIe9').then(!injectToggleButton || init);
