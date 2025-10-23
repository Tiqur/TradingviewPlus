class MoveTimeLeft extends Feature {
  private wheelReleaseTimer: number | null = null;
  private wheelActive = false;
  
  constructor() {
    super(
      'Move Time Left',
      'Moves Time Left',
      true,
      {
        key: 'z',
        ctrl: false,
        shift: false,
        alt: false,
        meta: false
      },
      Category.TV,
      true
    );
    this.addContextMenuOptions([
    ]);
  }

  onKey(e: KeyboardEvent) {
    if (!this.isEnabled() || !this.checkTrigger(e)) return;
    const isWheel = this.isWheelKey(e.key);
    const type: 'keydown' | 'keyup' = e.type === 'keyup' ? 'keyup' : 'keydown';
    if (isWheel) {
      this.handleWheelEvent(type);
    } else {
      this.dispatch(type);
    }
  }

  onMouseDown() {};

  onMouseMove() {};

  onKeyDown(e: KeyboardEvent) {
    this.onKey(e);
  };

  onMouseWheel(_e: WheelEvent) {};

  onKeyUp(e: KeyboardEvent) {
    this.onKey(e);
  };

  init() {}

  private dispatch(type: 'keydown' | 'keyup') {
    const chart = document.querySelector('.chart-page');
    if (!chart) return;
    chart.dispatchEvent(new KeyboardEvent(type, {
      keyCode: 37,
      key: 'ArrowLeft',
      altKey: true,
      bubbles: true,
      code: 'custom'
    }));
  }

  private handleWheelEvent(type: 'keydown' | 'keyup') {
    if (type === 'keydown') {
      if (!this.wheelActive) {
        this.dispatch('keydown');
        this.wheelActive = true;
      }
      if (this.wheelReleaseTimer !== null) {
        window.clearTimeout(this.wheelReleaseTimer);
        this.wheelReleaseTimer = null;
      }
      this.wheelReleaseTimer = window.setTimeout(() => this.releaseWheel(), 160);
    } else {
      this.releaseWheel();
    }
  }

  private releaseWheel() {
    if (!this.wheelActive) return;
    this.dispatch('keyup');
    this.wheelActive = false;
    if (this.wheelReleaseTimer !== null) {
      window.clearTimeout(this.wheelReleaseTimer);
      this.wheelReleaseTimer = null;
    }
  }

  private isWheelKey(key?: string | null): boolean {
    return !!key && key.startsWith('Wheel');
  }
}
