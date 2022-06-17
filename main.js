// I have never coded an addon before ( and am not trying to make it look nice ), so please forgive the bad code :)

// For chrome extension
if (typeof browser === "undefined") {
    var browser = chrome;
}

// Timeframe and color positions
let timeframeConfig = new Map();

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
const init = async () => {
  // Set config if saved locally
  const localConfig = await browser.storage.local.get('localConfig');
  if (Object.keys(localConfig).length > 0) timeframeConfig = new Map(Object.entries(JSON.parse(localConfig['localConfig'])));

  // Wrapper for toggleable tools ( magnet, etc )
  const toolWrapper = document.getElementsByClassName("group-3e32hIe9")[2].children[0];

  // Only inject if doesn't exist
  if (!document.getElementsByClassName('autoTimeframe')[0]) {

    // Clone magnet tool
    let cloneElement = document.getElementsByClassName('dropdown-m5d9X7vB')[8].cloneNode(true);

    // Add custom className and replace svg
    cloneElement.className += ' autoTimeframe'
    cloneElement.children[0].children[0].children[0].children[0].innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg>'
    cloneElement.innerHTML = cloneElement.innerHTML.replace('arrow-m5d9X7vB', 'arrow-m5d9X7vB autoTimeframeArrow')
    cloneElement.innerHTML = cloneElement.innerHTML.replace('bg-G7o5fBfa', 'bg-G7o5fBfa autoTimeframeElement')
    cloneElement.innerHTML = cloneElement.innerHTML.replace('button-G7o5fBfa', 'button-G7o5fBfa autoTimeframeButton')
    

    document.getElementsByClassName('group-3e32hIe9')[2].children[0].insertAdjacentElement('beforebegin', cloneElement);

    // Open and close menu to initialize hidden div ( yes this is hacky )
    document.getElementsByClassName('arrow-m5d9X7vB')[1].click()
    document.getElementsByClassName('arrow-m5d9X7vB')[1].click()

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
        itemIcon.style.width = '18px';
        itemIcon.style.height = '18px';
        itemIcon.style.borderRadius = '2px';
        itemIcon.style.background = color;
        item.appendChild(itemIcon);

        let itemLabel = document.createElement('div');
        itemLabel.className = 'labelRow-4TFSfyGO';
        item.appendChild(itemLabel)

        let itemLabelText = document.createElement('div');
        itemLabel.className = 'label-4TFSfyGO';
        itemLabel.innerText = label;
        item.appendChild(itemLabelText)

        return item;
      }

    const renderConfigMenu = () => {
      const timeframes = [].slice.call(document.getElementById("header-toolbar-intervals").children).filter(e => e.getAttribute('data-value')).map(e => e.innerText)

      // Reset timeframes incase they've been changed
      menuBox.innerHTML = ''

      // Add each timeframe
      timeframes.forEach(e => {

        // Set default values if doesn't exist
        if (!timeframeConfig.has(e)) {
          timeframeConfig.set(e, {color: 'rgb(255, 255, 255)', thickness: '1'});
        }

        // Create item
        const newItem = createItem(e, timeframeConfig.get(e).color);
        menuBox.appendChild(newItem);

        // Toggle item
        newItem.addEventListener('click', () => {

          // Untoggle all items
          Object.values(menuBox.children).forEach(item => {
            item.className = 'item-4TFSfyGO withIcon-4TFSfyGO';
          })

          // Toggle clicked item
          newItem.className = `item-4TFSfyGO withIcon-4TFSfyGO ${newItem.className.includes('isActive') ? '' : 'isActive-4TFSfyGO'}`

          // Open color picker
          openColorPickerMenu(e);
        })

      });
    }

    const openColorPickerMenu = (timeframe) => {
      // Click options in top right
      document.getElementsByClassName('iconButton-Kbdz4qEM button-SS83RYhy button-9pA37sIi apply-common-tooltip isInteractive-9pA37sIi newStyles-9pA37sIi')[0].click()

      waitForElm('.container-tuOy5zvD').then(() => {
        // Click apperance
        document.getElementsByClassName('tab-Zcmov9JL')[3].click()

        // Click crosshair color picker
        document.getElementsByClassName('colorPicker-pz6IRAmC')[6].click()

        // Delete settings menu ( while keeping color picker )
        document.getElementsByClassName('dialog-hxnnZcZ6 dialog-HExheUfY withSidebar-26RvWdey dialog-Nh5Cqdeo rounded-Nh5Cqdeo shadowed-Nh5Cqdeo')[0].innerHTML = "";
        document.getElementsByClassName('dialog-hxnnZcZ6 dialog-HExheUfY withSidebar-26RvWdey dialog-Nh5Cqdeo rounded-Nh5Cqdeo shadowed-Nh5Cqdeo')[0].style = 'hidden: true';

        // Reposition
        document.getElementsByClassName('menuWrap-8MKeZifP')[1].style = 'position: fixed; left: 130px; top: 140px;'

        const menuContainerElement = document.getElementsByClassName('menuBox-8MKeZifP')[1];
        const allColorElements = [...[].slice.call(document.getElementsByClassName('menuBox-8MKeZifP')[1].children[0].children[0].children), ...[].slice.call(document.getElementsByClassName('menuBox-8MKeZifP')[1].children[0].children[1].children), ...[].slice.call(document.getElementsByClassName('menuBox-8MKeZifP')[1].children[0].children[3].children).filter(e => !e.getAttribute('title'))];

        // On add custom color
        document.getElementsByClassName('customButton-WiTVOllB apply-common-tooltip')[0].addEventListener('click', () => {
          waitForElm('.content-YKkCvwjV').then(() => {
            document.getElementsByClassName('button-YKkCvwjV size-xsmall-YKkCvwjV color-brand-YKkCvwjV variant-primary-YKkCvwjV')[0].addEventListener('click', () => {
              waitForElm('.opacitySliderGradient-YL5Gjk00').then(() => {
                openColorPickerMenu(timeframe);
              })
            })
          })
        })

        // Delete opacity
        menuContainerElement.children[0].children[4].remove();
        menuContainerElement.children[0].children[4].remove();

        let doneButton = document.createElement('div');
        doneButton.style.background = '#2962ff';
        doneButton.style.borderRadius = '2px';
        doneButton.style.margin = '14px auto 8px auto';
        doneButton.style.width = '40%';
        doneButton.style.height = '30px';
        doneButton.style.textAlign = 'center';
        doneButton.style.verticalAlign = 'middle';
        doneButton.style.lineHeight = '30px';
        doneButton.innerText = 'Done';
        doneButton.addEventListener('mouseover', () => doneButton.style.cursor = 'pointer')
        doneButton.addEventListener('mouseout', () => doneButton.style.cursor = 'default')

        // Insert button element
        document.getElementsByClassName('container-WiTVOllB')[0].appendChild(doneButton);
        
        const getCurrentValues = () => {
          const color = allColorElements.filter(e => e.className.includes('selected'))[0].style.color;
          const thickness = 1;//[].slice.call(document.getElementsByClassName('wrap-sYKPueSl')[0].children).filter(e => e.className.includes('checked'))[0].children[0].value;
          return {color, thickness};
        }

        const setValues = (color, thickness) => {
          allColorElements.filter(e => e.style.color == color)[0].click();
          //[].slice.call(document.getElementsByClassName('wrap-sYKPueSl')[0].children)[thickness-1].children[0].click()
        }

        // Get crosshair config values to restore later
        const og = getCurrentValues();

        // Change to current timeframe settings in config
        const c = timeframeConfig.get(timeframe);
        setValues(c.color, c.thickness)

        // Submit
        doneButton.addEventListener('click', async () => {
          const timeframeConfigValues = getCurrentValues();
          
          // Update config
          timeframeConfig.set(timeframe, {color: timeframeConfigValues.color, thickness: timeframeConfigValues.thickness});

          // Set local storage
          await browser.storage.local.set({"localConfig": JSON.stringify(Object.fromEntries(timeframeConfig))})

          // Reset color picker to defaults before exit
          setValues(og.color, og.thickness)

          // Delete color picker and re-render
          menuContainerElement.innerHTML = '';
          renderConfigMenu();

        })
      })

    }


    autoTimeframeElement.addEventListener('click', () => {
      autoTimeframeElementButton.className = `button-G7o5fBfa ${autoTimeframeElementButton.className.includes('isActive') ? '' : 'isActive-G7o5fBfa'} autoTimeframeButton`
    })

    autoTimeframeElementArrow.addEventListener('click', () => {
      button.className = `dropdown-m5d9X7vB  ${button.className.includes('isOpened') ? '' : 'isOpened-m5d9X7vB'} autoTimeframe`;
      if (button.className.includes('isOpened')) {
        renderConfigMenu();
        document.getElementById('overlap-manager-root').appendChild(wrapper);
      } else {
        document.getElementById('overlap-manager-root').innerHTML = '';
      }
 
    })
  }



  let leftShiftDown = false;

  const handleLeftShiftKeyEvent = (e, a) => {
    if (e.code === "ShiftLeft") leftShiftDown = a;
    console.log("shift")
  }


  const timeframeButtons = [].slice.call(document.getElementsByClassName('wrap-H6XRnLaC')[0].children);

  // Allow scrolling of timeframes with leftshift and scroll wheel
  document.addEventListener('keydown', e => handleLeftShiftKeyEvent(e, true))
  document.addEventListener('keyup', e => handleLeftShiftKeyEvent(e, false))
  document.addEventListener('wheel', e => {
    if (!leftShiftDown) return;
    let currentTimeframe = [].slice.call(timeframeButtons).filter(e => e.className.includes("isActive"))[0].innerText;
    const direction = e.deltaY < 0 ? 'up' : 'down';
    const currentTimeframeIndex = timeframeButtons.map(e => e.className.includes('isActive')).indexOf(true);
    console.log(currentTimeframeIndex)
    const newTimeframeIndex = currentTimeframeIndex + (e.deltaY < 0 ? -1 : 1);
    if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length-1) {
      timeframeButtons[newTimeframeIndex].click();
    } 
  })


  document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', () => {
    let currentTimeframe = timeframeButtons.filter(e => e.className.includes("isActive"))[0].innerText;
    const currentConfig = timeframeConfig.get(currentTimeframe);

    // Close menu
    if (document.getElementsByClassName('autoTimeframe')[0].className.includes('isOpened')) {
      document.getElementsByClassName('autoTimeframeArrow')[0].click()
    }

    const drawingToolsActive = document.getElementsByClassName("floating-toolbar-react-widgets__button button-khcLBZEz apply-common-tooltip newStyles-khcLBZEz")[1].title == "Line tool colors";

    
    // If drawing tools is open ( opens after line click ) and autoTimeframe is enabled
    if (drawingToolsActive && document.getElementsByClassName('autoTimeframeButton')[0].className.includes('isActive')) {
      waitForElm('.floating-toolbar-react-widgets__button').then(() => {
        // Click line tool color picker
        document.getElementsByClassName("floating-toolbar-react-widgets__button button-khcLBZEz apply-common-tooltip newStyles-khcLBZEz")[1].click()

        // Set values
        const allColorElements = [...[].slice.call(document.getElementsByClassName('menuBox-8MKeZifP')[0].children[0].children[0].children), ...[].slice.call(document.getElementsByClassName('menuBox-8MKeZifP')[0].children[0].children[1].children), ...[].slice.call(document.getElementsByClassName('menuBox-8MKeZifP')[0].children[0].children[3].children).filter(e => !e.getAttribute('title'))];
        allColorElements.filter(e => e.style.color == currentConfig.color)[0].click();
        //[].slice.call(document.getElementsByClassName('wrap-sYKPueSl')[0].children)[currentConfig.thickness-1].children[0].click()
      })
    }
  });
}

waitForElm('.group-3e32hIe9').then(!injectToggleButton || init);
