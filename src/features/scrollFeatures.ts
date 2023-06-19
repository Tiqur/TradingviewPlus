class ScrollPriceScale extends FeatureClass {
  scrollFeaturesModifiers = [false, false];

  init() {
    document.addEventListener('keydown', e => {
      if (e.key === 'Shift') this.scrollFeaturesModifiers[0] = true;
      if (e.key === 'Control') this.scrollFeaturesModifiers[1] = true;
    })

    document.addEventListener('keyup', e => {
      if (e.key === 'Shift') this.scrollFeaturesModifiers[0] = false;
      if (e.key === 'Control') this.scrollFeaturesModifiers[1] = false;
    })

    // Disable time scrolling if left shift modifier key is pressed
    waitForElm('.chart-widget').then(() => {
      document.getElementsByClassName('chart-widget')[0].addEventListener('wheel', e => {
        if (this.scrollFeaturesModifiers[0] && (e as WheelEvent).clientX !== 0){
          // Zoom while scaling both price and time at the same time if modifier 2 is pressed
          if (!this.scrollFeaturesModifiers[1]) e.stopPropagation();

          // Just scroll price
          if (this.isEnabled())
            document.getElementsByClassName('price-axis')[0].dispatchEvent(new WheelEvent('wheel', {"deltaY": (e as WheelEvent).deltaY*8})) ;
        }
      }, true);
    })
  }
}


// This breaks hotkey setting for this feature by combining them
features['Scroll Price Scale'] = new ScrollPriceScale({
  name: 'Scroll Price Scale',
  tooltip: 'Allows you to scroll the price scale using a hotkey + the scroll wheel',
  enabled: true,
  hotkey: {
    key: null,
    alt: false,
    shift: true,
    ctrl: false,
    meta: false
  },
  category: 'Features',
  action: () => {}
});

// Placeholder for now just to show it under features menu
class ZoomChart extends FeatureClass {}
features['Zoom Both Axes'] = new ZoomChart({
  name: 'Zoom Both Axes',
  tooltip: 'Zooms both time and pice axes at the same time',
  enabled: true,
  hotkey: {
    key: null,
    alt: false,
    shift: true,
    ctrl: true,
    meta: false
  },
  category: 'Features',
  action: () => {}
});
