function enableDeleteDrawingHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key != key) return;
        document.querySelector('[data-name="remove"]').click()
  });
}
