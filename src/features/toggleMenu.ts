class ToggleMenu extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled())
        (document.getElementById('tvp-menu-button')?.children[0] as HTMLElement).click();
    });
  }
}

features['Toggle TVP Menu'] = new ToggleMenu({
  name: 'Toggle TVP Menu',
  tooltip: 'Opens and closes the TVP menu',
  enabled: true,
  hotkey: {
    key: 's',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features'
});
