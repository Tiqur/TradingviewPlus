const scrollToMostRecentBarKeyboardEventObj = {
  'keyCode': 39, 'altKey': true, 'shiftKey': true, 'bubbles': true, 'code': 'custom'
}

class ScrollToMostRecentBar extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        document.dispatchEvent(new KeyboardEvent('keydown', scrollToMostRecentBarKeyboardEventObj));
        document.dispatchEvent(new KeyboardEvent('keyup', scrollToMostRecentBarKeyboardEventObj));

        //snackBar('Scrolling to most recent candle...')
      }
    });
  }
}

features['Scroll To Most Recent Bar'] = new ScrollToMostRecentBar({
  name: 'Scroll To Most Recent Bar',
  tooltip: 'Scrolls to to most recent candle',
  enabled: true,
  hotkey: {
    key: 'f',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features',
  action: () => {}
});
