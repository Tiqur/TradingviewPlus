function enableLineWidthHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      // Click line thickness button
      document.querySelector('[data-name="line-tool-width"]').click()
      // Line thickness scrolling
      const thicknessButtons = [].slice.call(document.querySelector('[data-name="menu-inner"]').children);
      var activeIndex = thicknessButtons.findIndex(e => e.className.includes('isActive'))
      thicknessButtons[activeIndex != 3 ? activeIndex+1 : 0].click();
    }
  });
}
