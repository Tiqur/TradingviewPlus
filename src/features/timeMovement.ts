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
new TimeMovementLeft(menu_contents['Scroll Time Left']);
new TimeMovementRight(menu_contents['Scroll Time Right']);

