class MoveTimeRight extends Feature {
  private wheelReleaseTimer: number | null = null;
  private wheelActive = false;
  private wheelRepeatDelayTimer: number | null = null;
  private wheelRepeatInterval: number | null = null;
  
  constructor() {
    super(
      'Move Time Right',
      'Moves Time Right',
      true,
      {
        key: 'x',
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
      keyCode: 39,
      key: 'ArrowRight',
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
      this.bumpWheelRelease();
      this.ensureWheelRepeat();
    } else {
      this.releaseWheel();
    }
  }

  private releaseWheel() {
    if (!this.wheelActive) return;
    this.dispatch('keyup');
    this.wheelActive = false;
    this.clearWheelRelease();
    this.clearWheelRepeat();
  }

  private isWheelKey(key?: string | null): boolean {
    return !!key && key.startsWith('Wheel');
  }

  private ensureWheelRepeat() {
    if (this.wheelRepeatInterval !== null) return;
    if (this.wheelRepeatDelayTimer === null) {
      this.wheelRepeatDelayTimer = window.setTimeout(() => {
        this.wheelRepeatDelayTimer = null;
        if (!this.wheelActive) return;
        this.dispatch('keydown');
        this.wheelRepeatInterval = window.setInterval(() => {
          if (!this.wheelActive) { this.clearWheelRepeat(); return; }
          this.dispatch('keydown');
        }, 80);
      }, 330);
    }
  }

  private bumpWheelRelease() {
    this.clearWheelRelease();
    this.wheelReleaseTimer = window.setTimeout(() => this.releaseWheel(), 200);
  }

  private clearWheelRelease() {
    if (this.wheelReleaseTimer !== null) {
      window.clearTimeout(this.wheelReleaseTimer);
      this.wheelReleaseTimer = null;
    }
  }

  private clearWheelRepeat() {
    if (this.wheelRepeatDelayTimer !== null) {
      window.clearTimeout(this.wheelRepeatDelayTimer);
      this.wheelRepeatDelayTimer = null;
    }
    if (this.wheelRepeatInterval !== null) {
      window.clearInterval(this.wheelRepeatInterval);
      this.wheelRepeatInterval = null;
    }
  }
}
