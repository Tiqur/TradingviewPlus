const scrollToMostRecentBarKeyboardEventObj = {
  'keyCode': 39, 'altKey': true, 'shiftKey': true, 'bubbles': true, 'code': 'custom'
}

document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'f') {
    document.dispatchEvent(new KeyboardEvent('keydown', scrollToMostRecentBarKeyboardEventObj));
    document.dispatchEvent(new KeyboardEvent('keyup', scrollToMostRecentBarKeyboardEventObj));

    //snackBar('Scrolling to most recent candle...')
  }
});
