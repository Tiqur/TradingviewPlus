class ToggleReplayMode extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.getElementById('header-toolbar-replay') as HTMLElement).click();
      }
    });
  }
}

new ToggleReplayMode(menu_contents['Toggle Replay Mode']);

