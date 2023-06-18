// Handle both types of key presses
function keyHandler(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'x')
    document.getElementsByClassName('chart-page')[0].dispatchEvent(new KeyboardEvent(e.type, {'keyCode': e.key.toLowerCase() === 'z' ? 37 : 39, 'altKey': true, 'bubbles': true, 'code': 'custom'}));
}

// Register events
document.addEventListener('keydown', e => e.ctrlKey || keyHandler(e));
document.addEventListener('keyup', e => keyHandler(e));
