class MinimalFullscreen extends Feature {
  private static readonly HOTKEY: Hotkey = { key: 'F11', ctrl: false, shift: false, alt: false, meta: false };
  private followingTopBar = false;

  constructor() {
    super(
      'Minimal Fullscreen',
      'Fullscreen keeps a compact top bar and pins the favourites toolbar (F11 or Shift + F; on XM, also its fullscreen button)',
      true,
      MinimalFullscreen.HOTKEY,
      Category.TVP,
      false
    );
  }

  onMouseDown() {};
  onMouseMove() {};
  // F11, Shift + F and XM's button are left to the browser, TradingView and XM; the platform follows them
  onKeyDown() {};
  onMouseWheel() {};
  onKeyUp() {};

  init() {
    // The hotkey can't be edited, so one saved by an earlier build is replaced
    if (this.getHotkey().key !== MinimalFullscreen.HOTKEY.key) this.setHotkey(MinimalFullscreen.HOTKEY);
    this.apply();
  }

  // On XM it follows XM's own fullscreen button rather than F11
  public getAlternateHotkeyLabels(): null | string[] {
    return window.TVP_Platform?.platformName === 'XM' ? ['XM Fullscreen'] : null;
  }

  // Only TradingView and XM have it so far; on other platforms the box stays unticked
  public isEnabled(): boolean {
    return !!window.TVP_Platform?.setMinimalFullscreen && super.isEnabled();
  }

  public toggleEnabled() {
    if (!window.TVP_Platform?.setMinimalFullscreen) {
      menu.injectFeatures(Array.from(features.values()));
      snackBar('Minimal Fullscreen is not configured for this platform yet');
      return;
    }

    super.toggleEnabled();
    this.apply();
  }

  // The layout itself is in tvp-minimal-fullscreen.scss and applies while the chart's own
  // fullscreen layout is on; the platform switches that layout on and off
  private apply() {
    const platform = window.TVP_Platform;
    if (!platform?.setMinimalFullscreen) return;
    document.documentElement.classList.toggle('tvp-minimal-fullscreen', this.isEnabled());

    if (!this.followingTopBar) {
      this.followingTopBar = true;
      this.followTopBar();
    }
    platform.setMinimalFullscreen(this.isEnabled());
  }

  private followTopBar() {
    const root = document.documentElement;
    waitForElm('.layout__area--top').then(elem => {
      const top = elem as HTMLElement;

      // The pinned favourites toolbar starts where the shrunk top bar ends
      new ResizeObserver(() => {
        root.style.setProperty('--tvp-top-bar-width', top.offsetWidth + 'px');
      }).observe(top);

      // TradingView re-places the favourites toolbar on every resize from where it is drawn,
      // so resizes while it is pinned (entering/leaving browser fullscreen) would leave it in
      // the wrong place afterwards: keep its own position and put it back when fullscreen ends
      let wasFullscreen = top.classList.contains('js-hidden');
      let toolbarPosition: { left: string, top: string } | null = null;
      new MutationObserver(() => {
        const isFullscreen = top.classList.contains('js-hidden');
        const toolbar = document.querySelector<HTMLElement>('.tv-floating-toolbar:has(.tv-favorited-drawings-toolbar__widget)');
        const minimal = root.classList.contains('tvp-minimal-fullscreen');
        if (isFullscreen && !wasFullscreen) {
          toolbarPosition = minimal && toolbar ? { left: toolbar.style.left, top: toolbar.style.top } : null;
        } else if (!isFullscreen && wasFullscreen && minimal && toolbar && toolbarPosition) {
          toolbar.style.left = toolbarPosition.left;
          toolbar.style.top = toolbarPosition.top;
        }
        wasFullscreen = isFullscreen;
      }).observe(top, { attributes: true, attributeFilter: ['class'] });
    });
  }
}
