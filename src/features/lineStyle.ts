document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'q') {
    // Click line style button
    (document.querySelector('[data-name="style"]') as HTMLElement).click()

    // Line style scrolling
    const styleButtons = [].slice.call((document.querySelector('[data-name="menu-inner"]') as HTMLElement).children[0].children[0].children).filter(e => (e as HTMLElement).children.length > 1);
    var activeIndex = styleButtons.findIndex(e => (e as HTMLElement).className.includes(' active-')) as number;
    (styleButtons[activeIndex != 2 ? activeIndex+1 : 0] as HTMLElement).click();
  }
});
