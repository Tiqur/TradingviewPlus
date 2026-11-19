class MinimalFullscreen extends Feature {
  private static readonly HOTKEY: Hotkey = { key: 'F11', ctrl: false, shift: false, alt: false, meta: false };

  constructor() {
    super(
      'Minimal Fullscreen',
      'Browser fullscreen (F11) or TradingView\'s fullscreen (Shift + F) keeps a compact top bar and pins the favourites toolbar',
      true,
      MinimalFullscreen.HOTKEY,
      Category.TVP,
      false
    );
  }

  onMouseDown() {};
  onMouseMove() {};
  // F11 and Shift + F are left to the browser and TradingView; the platform follows them
  onKeyDown() {};
  onMouseWheel() {};
  onKeyUp() {};

  init() {
    // The hotkey can't be edited, so one saved by an earlier build is replaced
    if (this.getHotkey().key !== MinimalFullscreen.HOTKEY.key) this.setHotkey(MinimalFullscreen.HOTKEY);
    window.TVP_Platform?.setMinimalFullscreen?.(this.isEnabled());
  }

  // Only TradingView has it so far; on other platforms the box stays unticked
  public isEnabled(): boolean {
    return !!window.TVP_Platform?.setMinimalFullscreen && super.isEnabled();
  }

  public toggleEnabled() {
    const platform = window.TVP_Platform;
    if (!platform?.setMinimalFullscreen) {
      menu.injectFeatures(Array.from(features.values()));
      snackBar('Minimal Fullscreen is not configured for this platform yet');
      return;
    }

    super.toggleEnabled();
    platform.setMinimalFullscreen(this.isEnabled());
  }
}
