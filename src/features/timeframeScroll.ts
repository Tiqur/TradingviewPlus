class TimeframeScroll extends FeatureClass {
  modifierPressed: boolean = false;
  init() {
    document.addEventListener('keydown', e => {if (this.checkTrigger(e)) this.modifierPressed = true})
    document.addEventListener('keyup', e => {if (this.checkTrigger(e)) this.modifierPressed = false})

    // Unselect ( press Esc ) when manually chaning timeframes 
    waitForElm('#header-toolbar-intervals').then(() => {
      document.getElementById('header-toolbar-intervals')?.addEventListener('click', e => {
        document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent('keydown', {'bubbles': true, 'keyCode': 27}));
      })
    });

    document.addEventListener('wheel', e => {
      if (this.modifierPressed && this.isEnabled()) {
        document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent('keydown', {'bubbles': true, 'keyCode': 27}));
        const timeframeButtons = [].slice.call(document.querySelector('[id="header-toolbar-intervals"]')?.children[0].children)
        const currentTimeframe = (timeframeButtons.filter(e => (e as HTMLElement).className.includes('isActive'))[0] as HTMLElement).innerText;
        const direction = e.deltaY < 0 ? 'up' : 'down';
        const currentTimeframeIndex = timeframeButtons.map(e => (e as HTMLElement).className.includes('isActive')).indexOf(true);
        const newTimeframeIndex = currentTimeframeIndex + (e.deltaY < 0 ? -1 : 1);
        if (newTimeframeIndex > -1 && newTimeframeIndex < timeframeButtons.length-1) {
          (timeframeButtons[newTimeframeIndex] as HTMLElement).click();
        } 
      }
    });
  }
}

features['Scroll Timeframes'] = new TimeframeScroll({
  name: 'Scroll Timeframes',
  tooltip: 'Allows you to scroll through timeframes using a hotkey + the scroll wheel',
  enabled: true,
  hotkey: {
    key: 'Tab',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features',
  action: () => {}
});

