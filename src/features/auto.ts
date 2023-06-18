function enableAutoScaleHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      document.querySelector('[data-name="auto"]').click();
      //snackBar('Toggled Auto Scale');
    }
  });
}
