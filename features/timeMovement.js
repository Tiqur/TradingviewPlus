function enableTimeMovementHotkeys(key1, key2) {
  // Handle both types of key presses
  function keyHandler(e) {
    if (e.ctrlKey) return;
    if (e.key === key1 || e.key === key2)
      document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent(e.type, {'keyCode': e.key === key1 ? 37 : 39, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
  }
  
  // Register events
  document.addEventListener('keydown', e => keyHandler(e));
  document.addEventListener('keyup', e => keyHandler(e));
}
