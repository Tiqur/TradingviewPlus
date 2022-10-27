function enableLineWidthHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      // Click line thickness button
      document.querySelector('[data-name="line-tool-width"]').click()
      // Line thickness scrolling
      const thicknessButtons = [].slice.call(document.querySelectorAll('[data-name="menu-inner"]')[1].children);
      var activeIndex = thicknessButtons.findIndex(e => e.className.includes('isActive'))
      thicknessButtons[activeIndex != 3 ? activeIndex+1 : 0].click();
    }
  });
}
