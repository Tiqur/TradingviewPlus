// Disable default TV hotkeys
document.addEventListener("keypress", event => event.stopPropagation(), true);

// Shift key down ( for timeframe scrolling )
let leftShiftDown = false;

let rainbow = false;


function snackBar(text) {
  const snackContainer = document.createElement('div');
  snackContainer.setAttribute('id', 'snackbar')
  snackContainer.setAttribute('class', 'show')
  setTimeout(() => snackContainer.setAttribute('class', ''), 3000)

  const snack = document.createElement('div');
  snack.setAttribute('style', 'background: #2962ff; padding: 1em 2em 1em 2em; margin-top: 2em; border-radius: 4px; display: flex; justify-content: center; align-items: center;');
  snack.innerHTML = `<p>${text}</p>`;
  snackContainer.appendChild(snack);

  document.getElementById('overlap-manager-root').appendChild(snackContainer);
}



// Handle shift down event
const handleKeyDown = (e, a) => {
  // Toggle shift modifier key
  if (e.key === "Shift") leftShiftDown = a;

  // Handle rest of keys
  if (!a) return;
  switch (e.key) {
    case "q":   // Scroll line styles
      // Click line style button
      document.querySelector('[data-name="style"]').click()
      // Line style scrolling
      const styleButtons = [].slice.call(document.querySelector('[data-name="menu-inner"]').children[0].children[0].children).filter(e => e.children.length > 1);
      var activeIndex = styleButtons.findIndex(e => e.className.includes(' active-'))
      styleButtons[activeIndex != 2 ? activeIndex+1 : 0].click();
    break;
    case "w":   // Scroll line thickness
      // Click line thickness button
      document.querySelector('[data-name="line-tool-width"]').click()
      // Line thickness scrolling
      const thicknessButtons = [].slice.call(document.querySelector('[data-name="menu-inner"]').children);
      console.log(thicknessButtons)
      var activeIndex = thicknessButtons.findIndex(e => e.className.includes('isActive'))
      thicknessButtons[activeIndex != 3 ? activeIndex+1 : 0].click();
    break;
    case "r": // Replay mode toggle
      document.getElementById('header-toolbar-replay').click();
    break;
    case "a":
      document.querySelector('[data-name="auto"]').click();
    break;
    case "c":
      // Wait for toolbar
      waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
        // Click Line tool colors on toolbar
        document.getElementsByClassName('floating-toolbar-react-widgets__button')[4].click()
          waitForElm('[name="y-input"]').then((e) => {
            const value = document.querySelector('[name="y-input"]').value;
            document.querySelector('[data-name="submit-button"]').click();
            navigator.clipboard.writeText(value);
            snackBar(`Copied ${value} to clipboard`);
        })
      })
    break;
  }
}


// Allow scrolling of timeframes with leftshift and scroll wheel
document.addEventListener('keydown', e => handleKeyDown(e, true))
document.addEventListener('keyup', e => handleKeyDown(e, false))
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

