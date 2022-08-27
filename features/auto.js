function enableAutoScaleHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key === key) {
      document.querySelector('[data-name="auto"]').click();
    }
  });
}
