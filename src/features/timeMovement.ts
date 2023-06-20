class TimeMovementLeft extends FeatureClass {
  // Handle both types of key presses
  keyHandler(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent(e.type, {'keyCode': e.key.toLowerCase() === 'z' ? 37 : 39, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
    }
  }

  init() {
    // Register events
    document.addEventListener('keydown', e => e.ctrlKey || this.keyHandler(e));
    document.addEventListener('keyup', e => this.keyHandler(e));
  }
}

class TimeMovementRight extends FeatureClass {
  // Handle both types of key presses
  keyHandler(e: KeyboardEvent) {
    if (this.checkTrigger(e) && this.isEnabled()) {
      document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent(e.type, {'keyCode': e.key.toLowerCase() === 'z' ? 37 : 39, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
    }
  }

  init() {
    // Register events
    document.addEventListener('keydown', e => e.ctrlKey || this.keyHandler(e));
    document.addEventListener('keyup', e => this.keyHandler(e));
  }
}

// There's definitely a better method than creating two duplicate classes
// but this will work for now
features['Scroll Time Left'] = new TimeMovementLeft({
  name: 'Scroll time left',
  tooltip: 'Scrolls backward in time',
  enabled: true,
  hotkey: {
    key: 'z',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features'
});
features['Scroll Time Right'] = new TimeMovementRight({
  name: 'Scroll time right',
  tooltip: 'Scrolls forward in time',
  enabled: true,
  hotkey: {
    key: 'x',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features'
});

