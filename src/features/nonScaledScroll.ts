function enableNonScaled(modiferKey) {
  let modifiers = [false, false];

  document.addEventListener('keydown', e => {
    console.log(e.key)
    if (e.key === modiferKey) modifiers[0] = true;
    if (e.key === 'Control') modifiers[1] = true;
  })

  document.addEventListener('keyup', e => {
    if (e.key === modiferKey) modifiers[0] = false;
    if (e.key === 'Control') modifiers[1] = false;
  })

  // Disable time scrolling if left shift modifier key is pressed
  waitForElm('.chart-widget').then(() => {
    document.getElementsByClassName('chart-widget')[0].addEventListener('wheel', e => {
      if (modifiers.every(v => v) && e.clientX !== 0) {
         document.getElementsByClassName('price-axis')[0].dispatchEvent(new WheelEvent('wheel', {"deltaY": e.deltaY*8})) ;
      }
    }, true);
  })
}
