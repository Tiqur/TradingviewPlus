class ToggleAutoScale extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.querySelector('[data-name="auto"]') as HTMLElement).click();
        //snackBar('Toggled Auto Scale');
      }
    });
  }
}

features['Toggle Auto Scale'] = new ToggleAutoScale({
  name: 'Toggle Auto Scale',
  tooltip: 'Toggles the chart\'s "Auto" scale',
  enabled: true,
  hotkey: {
    key: 'a',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features'
});

