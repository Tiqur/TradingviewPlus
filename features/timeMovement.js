function enableTimeMovementHotkeys(key1, key2) {
  // Handle both types of key presses
  function keyHandler(e) {
    if (e.key.toLowerCase() === key1 || e.key.toLowerCase() === key2)
      document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent(e.type, {'keyCode': e.key.toLowerCase() === key1 ? 37 : 39, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
  }
  
  // Register events
  document.addEventListener('keydown', e => e.ctrlKey || keyHandler(e));
  document.addEventListener('keyup', e => keyHandler(e));
}
