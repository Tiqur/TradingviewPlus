class LineWidth extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        // Click line thickness button
        (document.querySelector('[data-name="line-tool-width"]') as HTMLElement).click()
        // Line thickness scrolling
        const thicknessButtons = [].slice.call((document.querySelector('[data-name="menu-inner"]') as HTMLElement).children);
        var activeIndex = thicknessButtons.findIndex(e => (e as HTMLElement).className.includes('isActive')) as number;
        (thicknessButtons[activeIndex != 3 ? activeIndex+1 : 0] as HTMLElement).click();
      }
    });
  }
}

features['Change Line Width'] = new LineWidth({
  name: 'Change Line Width',
  tooltip: 'Scrolls line width ( 1px, 2px, 3px, 4px )',
  enabled: true,
  hotkey: {
    key: 'w',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features'
});
