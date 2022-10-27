function enableLineStyleHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      // Click line style button
      document.querySelector('[data-name="style"]').click()

      // Line style scrolling
      const styleButtons = [].slice.call(document.querySelectorAll('[data-name="menu-inner"]')[1].children[0].children[0].children).filter(e => e.children.length > 1);
      var activeIndex = styleButtons.findIndex(e => e.className.includes(' active-'))
      styleButtons[activeIndex != 2 ? activeIndex+1 : 0].click();
    }
  });
}
