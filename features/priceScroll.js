function enablePriceScroll(modiferKey) {
  let modifierPressed = false;
  document.addEventListener('keydown', e => {if (e.key.toLowerCase() === modiferKey) modifierPressed = true})
  document.addEventListener('keyup', e => {if (e.key.toLowerCase() === modiferKey) modifierPressed = false})

  // Disable time scrolling if left shift modifier key is pressed
  waitForElm('.chart-widget').then(() => {
    document.getElementsByClassName('chart-widget')[0].addEventListener('wheel', e => {
      if (modifierPressed && e.clientX !== 0){
         e.stopPropagation();
         document.getElementsByClassName('price-axis')[0].dispatchEvent(new WheelEvent('wheel', {"deltaY": e.deltaY*8})) ;
      }
    }, true);
  })
}
