class NextWatchlistTicker extends Feature {

  constructor() {
    super(
      'Next Watchlist Ticker',
      'Space / Shift + Space: next / previous instrument in XM\'s watchlist',
      true,
      {
        key: ' ',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.XM,
      false,
      ['Space']
    );
  }

  onMouseDown() {};
  onMouseMove() {};
  // The platform listens for Space itself, since XM's watchlist is outside the chart
  onKeyDown() {};
  onMouseWheel() {};
  onKeyUp() {};

  init() {
    window.TVP_Platform?.setWatchlistSpaceKey?.(this.isEnabled());
  }

  public toggleEnabled() {
    super.toggleEnabled();
    window.TVP_Platform?.setWatchlistSpaceKey?.(this.isEnabled());
  }
}
