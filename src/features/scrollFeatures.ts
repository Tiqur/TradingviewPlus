//class ScrollPriceScale extends FeatureClass {
//  scrollFeaturesModifiers = [false, false];
//
//  init() {
//    document.addEventListener('keydown', e => {
//      if (e.key === 'Shift') this.scrollFeaturesModifiers[0] = true;
//      if (e.key === 'Control') this.scrollFeaturesModifiers[1] = true;
//    })
//
//    document.addEventListener('keyup', e => {
//      if (e.key === 'Shift') this.scrollFeaturesModifiers[0] = false;
//      if (e.key === 'Control') this.scrollFeaturesModifiers[1] = false;
//    })
//
//    // Disable time scrolling if left shift modifier key is pressed
//    waitForElm('.chart-widget').then(() => {
//      document.getElementsByClassName('chart-widget')[0].addEventListener('wheel', e => {
//        if (this.scrollFeaturesModifiers[0] && (e as WheelEvent).clientX !== 0){
//          // Zoom while scaling both price and time at the same time if modifier 2 is pressed
//          if (!this.scrollFeaturesModifiers[1]) e.stopPropagation();
//
//          // Just scroll price
//          if (this.isEnabled())
//            document.getElementsByClassName('price-axis')[0].dispatchEvent(new WheelEvent('wheel', {"deltaY": (e as WheelEvent).deltaY*8})) ;
//        }
//      }, true);
//    })
//  }
//}
//
//new ScrollPriceScale(menu_contents['Scroll Price Scale']);
//
//// This breaks hotkey setting for this feature by combining them
//
