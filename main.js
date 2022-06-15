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
    // Clone magnet tool
    let cloneElement = document.getElementsByClassName('dropdown-m5d9X7vB')[8].cloneNode(true);
    const oldPath = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="nonzero" d="M14 5a7 7 0 0 0-7 7v3h4v-3a3 3 0 1 1 6 0v3h4v-3a7 7 0 0 0-7-7zm7 11h-4v3h4v-3zm-10 0H7v3h4v-3zm-5-4a8 8 0 1 1 16 0v8h-6v-8a2 2 0 1 0-4 0v8H6v-8zm3.293 11.294l-1.222-2.037.858-.514 1.777 2.963-2 1 1.223 2.037-.858.514-1.778-2.963 2-1zm9.778-2.551l.858.514-1.223 2.037 2 1-1.777 2.963-.858-.514 1.223-2.037-2-1 1.777-2.963z"></path></svg>';
    const newPath = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg>';

    // Add custom className and replace svg
    cloneElement.className += ' autoTimeframe'
    cloneElement.innerHTML = cloneElement.innerHTML.replace(oldPath, newPath)
    cloneElement.innerHTML = cloneElement.innerHTML.replace('arrow-m5d9X7vB', 'arrow-m5d9X7vB autoTimeframeArrow')
    cloneElement.innerHTML = cloneElement.innerHTML.replace('bg-G7o5fBfa', 'bg-G7o5fBfa autoTimeframeElement')
    cloneElement.innerHTML = cloneElement.innerHTML.replace('button-G7o5fBfa', 'button-G7o5fBfa autoTimeframeButton')
    

    document.getElementsByClassName('group-3e32hIe9')[2].children[0].insertAdjacentElement('beforebegin', cloneElement);

    let autoTimeframeElementButton = document.getElementsByClassName('autoTimeframeButton')[0];
    let autoTimeframeElement = document.getElementsByClassName('autoTimeframeElement')[0];
    let autoTimeframeElementArrow = document.getElementsByClassName('autoTimeframeArrow')[0];
    const button = document.getElementsByClassName('autoTimeframe')[0];
    
          let wrapper = document.createElement('div');
      wrapper.style = 'position: fixed; z-index: 12; inset: 0px; pointer-events: none;';

      let span = document.createElement('span');
      span.style = 'pointer-events: auto;';
      wrapper.appendChild(span);

      let menuWrap = document.createElement('div');
      menuWrap.className = 'menuWrap-8MKeZifP';
      menuWrap.style = 'position: fixed; left: 53px; top: 140px;';
      span.appendChild(menuWrap);

      let scrollWrap = document.createElement('div');
      scrollWrap.className = 'scrollWrap-8MKeZifP momentumBased-8MKeZifP';
      scrollWrap.style = 'overflow-y: auto;'
      menuWrap.appendChild(scrollWrap);

      let menuBox = document.createElement('div');
      menuBox.className = 'menuBox-8MKeZifP'
      menuBox.setAttribute('data-name', 'menu-inner')
      scrollWrap.appendChild(menuBox);


      const createItem = (label, color) => {
        // Menu Item
        let item = document.createElement('div');
        item.className = 'item-4TFSfyGO withIcon-4TFSfyGO';
        item.setAttribute('data-name', label)

        let itemIcon = document.createElement('div');
        itemIcon.className = 'icon-4TFSfyGO';
        itemIcon.setAttribute('innerHTML', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg>');
        item.appendChild(itemIcon);

        let itemLabel = document.createElement('div');
        itemLabel.className = 'labelRow-4TFSfyGO';
        item.appendChild(itemLabel)

        let itemLabelText = document.createElement('div');
        itemLabel.className = 'label-4TFSfyGO';
        itemLabel.innerText = label;
        item.appendChild(itemLabelText)

        // Toggle item
        item.addEventListener('click', () => {
          item.className = `item-4TFSfyGO withIcon-4TFSfyGO ${item.className.includes('isActive') ? '' : 'isActive-4TFSfyGO'}`
        })

        return item;
      }


    autoTimeframeElement.addEventListener('click', () => {
      autoTimeframeElementButton.className = `button-G7o5fBfa ${autoTimeframeElementButton.className.includes('isActive') ? '' : 'isActive-G7o5fBfa'} autoTimeframeElementButton`
    })

    autoTimeframeElementArrow.addEventListener('click', () => {
      button.className = `dropdown-m5d9X7vB  ${button.className.includes('isOpened') ? '' : 'isOpened-m5d9X7vB'} autoTimeframe`
    })

    autoTimeframeElementArrow.addEventListener('click', () => {

      if (button.className.includes('isOpened')) {
        const timeframes = [].slice.call(document.getElementById("header-toolbar-intervals").children).filter(e => e.getAttribute('data-value')).map(e => e.innerText)

        timeframes.forEach(e => {
          menuBox.appendChild(createItem(e, 'red'));
        });

        document.getElementById('overlap-manager-root').appendChild(wrapper);
      } else {
        document.getElementById('overlap-manager-root').innerHTML = '';
      }
 
    })

    // Create new element
    //let newElement = document.createElement('div');
    //newElement.className = `button-G7o5fBfa dropdown-m5d9X7vB ${enabledOnStartup ? 'isActive-G7o5fBfa ' : ''} autoTimeframe`;
    //newElement.innerHTML = '<div class="bg-G7o5fBfa"><span class="icon-G7o5fBfa"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg></span></div>';
    //toolWrapper.insertAdjacentElement('beforebegin', newElement);
    //
    // Add event listener
  }


  document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', () => {
    let currentTimeframe = [].slice.call(document.getElementById("header-toolbar-intervals").children).filter(e => e.className.includes("isActive"))[0].innerText;
    const drawingToolsActive = document.getElementsByClassName("floating-toolbar-react-widgets__button button-khcLBZEz apply-common-tooltip newStyles-khcLBZEz")[1].title == "Line tool colors";
    
    // If drawing tools is open ( opens after line click ) and autoTimeframe is enabled
    if (drawingToolsActive && document.getElementsByClassName('autoTimeframe')[0].className.includes('isActive')) {
      // Click line tool color picker
      document.getElementsByClassName("floating-toolbar-react-widgets__button button-khcLBZEz apply-common-tooltip newStyles-khcLBZEz")[1].click()
      //[].slice.call(document.getElementsByClassName("swatches-qgksmXjR")[2].children).filter(e => e.className.includes("tooltip"))[0].click();

      //waitForElm("customButton-WiTVOllB apply-common-tooltip").then(document.getElementsByClassName("customButton-WiTVOllB apply-common-tooltip")[0].focus());
      // Click color according to timeframe 
      //document.getElementsByClassName("swatches-qgksmXjR")[2].children[timeframeColors[currentTimeframe]].click()
    }

  });
}

waitForElm('.group-3e32hIe9').then(!injectToggleButton || init);
