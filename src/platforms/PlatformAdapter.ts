/**
 * PlatformAdapter — Abstract contract every platform must satisfy.
 *
 * Implement this interface to teach the extension how to interact
 * with the DOM on a new third-party trading platform. A concrete
 * adapter is constructed once in main.ts and exposed globally via
 * `window.TVP_Platform`, so all Feature classes can query it
 * without knowing which site they are running on.
 */
interface PlatformAdapter {
  /** Human-readable name shown in logs / future debug UI */
  readonly platformName: string;

  // ─── Timeframe ────────────────────────────────────────────────────────────

  /**
   * Returns the text content (e.g. "4h", "D") of the currently
   * selected timeframe button, or null when it cannot be determined.
   */
  getCurrentTimeframe(): string | null;

  /**
   * Returns the container element that holds the timeframe buttons so
   * the extension can attach a MutationObserver to it.
   */
  getTimeframeContainer(): Element | null;

  // ─── Color Picker ─────────────────────────────────────────────────────────

  /**
   * Returns the "line tool color" button in the floating toolbar that,
   * when clicked, opens the platform's colour-picker popup.
   */
  getLineColorButton(): HTMLElement | null;

  /**
   * Returns true when the colour-picker popup is already open so we
   * can skip re-opening it.
   */
  isColorMenuOpen(): boolean;

  /**
   * Returns all clickable colour swatch elements from the currently
   * open colour-picker popup.
   */
  getColorSwatches(): HTMLElement[];

  // ─── Drawing Toolbar ──────────────────────────────────────────────────────

  /**
   * Returns true when the given click target (or one of its ancestors)
   * belongs to the left-side drawing tool selector bar.
   */
  isClickOnDrawingToolbar(target: HTMLElement): boolean;

  /**
   * Returns true when the given DOM node (or one of its children) is a
   * floating toolbar that appears after the user selects a drawing tool.
   */
  isFloatingToolbarNode(node: HTMLElement): boolean;
}

// Expose on window so features can access the active platform globally
declare interface Window {
  TVP_Platform: PlatformAdapter;
}
