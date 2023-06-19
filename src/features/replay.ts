class ToggleReplayMode extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.getElementById('header-toolbar-replay') as HTMLElement).click();
      }
    });
  }
}

features['Toggle Replay Mode'] = new ToggleReplayMode({
  name: 'Toggle Replay Mode',
  tooltip: 'Toggles replay mode ( must have pro plan or higher )',
  enabled: true,
  hotkey: {
    key: 'r',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features',
  action: () => {}
});

