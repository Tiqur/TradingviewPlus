function enableTimeframeScroll(modiferKey) {
  let modifierPressed = false;
  document.addEventListener('keydown', e => {if (e.key === modiferKey) modifierPressed = true})
  document.addEventListener('keyup', e => {if (e.key === modiferKey) modifierPressed = false})

  document.addEventListener('wheel', e => {
    // Timeframe scrolling
    if (modifierPressed) {
      const timeframeButtons = [].slice.call(document.querySelector('[id="header-toolbar-intervals"]').children)
      const currentTimeframe = timeframeButtons.filter(e => e.className.includes('isActive'))[0].innerText;
      const direction = e.deltaY < 0 ? 'up' : 'down';
      const currentTimeframeIndex = timeframeButtons.map(e => e.className.includes('isActive')).indexOf(true);
      const newTimeframeIndex = currentTimeframeIndex + (e.deltaY < 0 ? -1 : 1);
      if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length-1) {
        timeframeButtons[newTimeframeIndex].click();
      } 
    } 
  })
}
