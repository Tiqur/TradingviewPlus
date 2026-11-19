class SetupDefaults extends Feature {

  constructor() {
    super(
      'Setup Defaults',
      'Applies the default favourites and chart appearance',
      false,
      {
        key: null,
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TVP,
      false
    );
  }

  onMouseDown() {};
  onMouseMove() {};
  onKeyDown() {};
  onMouseWheel() {};
  onKeyUp() {};

  init() {};

  // An action, not a setting: the box is never shown ticked
  public isEnabled(): boolean {
    return false;
  }

  // Ticking the box asks for confirmation, then closes the menu and applies the defaults
  public toggleEnabled() {
    const untick = () => menu.injectFeatures(Array.from(features.values()));

    if (!window.TVP_Platform?.setupDefaults) {
      untick();
      snackBar('Setup Defaults is not available on this site yet');
      return;
    }

    confirmDialog('Setup Defaults',
      'This applies custom defaults to this chart: favourite timeframes and drawing tools, chart colours and appearance, ' +
      'and removes the Volume indicator. Click Cancel to leave your chart as it is.'
    ).then(ok => {
      untick();
      if (!ok) return;
      menu.close();
      const done = window.TVP_Platform?.setupDefaults?.();
      snackBar(done ? 'Chart defaults applied' : 'Setup failed: chart menus not found');
    });
  }
}
