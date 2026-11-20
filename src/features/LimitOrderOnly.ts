class LimitOrderOnly extends Feature {
  private observer: MutationObserver | null = null;

  constructor() {
    super(
      'Limit Order Only',
      'Only limit orders can be placed: Market, Stop and Stop Limit are disabled',
      false,
      {
        key: 'l',
        ctrl: false,
        shift: true,
        alt: false,
        meta: false
      },
      Category.TVP,
      true
    );
    this.addContextMenuOptions([
    ]);
  }

  onMouseDown() { };
  onMouseMove() { };
  onKeyDown() { };
  onMouseWheel() { };
  onKeyUp() { };

  init() {
    const config = { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-selected'] };

    this.observer = new MutationObserver(() => {
      this.enforceLimitOnly();
    });

    this.observer.observe(document.body, config);

    // Some platforms (e.g. XM) keep their own order ticket outside the chart
    const ticketRoot = window.TVP_Platform?.getOrderTicketRoot?.();
    if (ticketRoot) this.observer.observe(ticketRoot, config);
  }

  private enforceLimitOnly() {
    window.TVP_Platform?.enforceLimitOrderOnly?.(this.isEnabled());

    const tabs = ['Market', 'Stop', 'StopLimit'];
    if (this.isEnabled()) {
      tabs.forEach(tabId => {
        const btn = document.getElementById(tabId) as HTMLButtonElement;
        if (btn) {
          btn.style.pointerEvents = 'none';
          btn.style.opacity = '0.1';
        }
      });

      const sellBtn = document.querySelector('[data-name="sell-order-button"]') as HTMLDivElement;
      if (sellBtn) {
        sellBtn.style.pointerEvents = 'none';
        sellBtn.style.opacity = '0.1';
      }

      const buyBtn = document.querySelector('[data-name="buy-order-button"]') as HTMLDivElement;
      if (buyBtn) {
        buyBtn.style.pointerEvents = 'none';
        buyBtn.style.opacity = '0.1';
      }

      const radioButtons = Array.from(document.querySelectorAll('button[role="radio"]')) as HTMLButtonElement[];
      let orderBtn: HTMLButtonElement | null = null;
      let domBtn: HTMLButtonElement | null = null;
      radioButtons.forEach(btn => {
        if (btn.textContent === 'Order') orderBtn = btn as HTMLButtonElement;
        if (btn.textContent === 'DOM') domBtn = btn as HTMLButtonElement;
      });

      if (domBtn) {
        (domBtn as HTMLButtonElement).style.pointerEvents = 'none';
        (domBtn as HTMLButtonElement).style.opacity = '0.1';
        if ((domBtn as HTMLButtonElement).getAttribute('aria-checked') === 'true' && orderBtn) {
          (orderBtn as HTMLButtonElement).click();
        }
      }

      const limitBtn = document.getElementById('Limit') as HTMLButtonElement;

      const marketBtn = document.getElementById('Market');
      const stopBtn = document.getElementById('Stop');
      const stopLimitBtn = document.getElementById('StopLimit');

      if (limitBtn && (
        (marketBtn && marketBtn.getAttribute('aria-selected') === 'true') ||
        (stopBtn && stopBtn.getAttribute('aria-selected') === 'true') ||
        (stopLimitBtn && stopLimitBtn.getAttribute('aria-selected') === 'true')
      )) {
        limitBtn.click();
      }
    } else {
      tabs.forEach(tabId => {
        const btn = document.getElementById(tabId) as HTMLButtonElement;
        if (btn) {
          btn.style.pointerEvents = '';
          btn.style.opacity = '';
        }
      });

      const sellBtn = document.querySelector('[data-name="sell-order-button"]') as HTMLDivElement;
      if (sellBtn) {
        sellBtn.style.pointerEvents = '';
        sellBtn.style.opacity = '';
      }

      const buyBtn = document.querySelector('[data-name="buy-order-button"]') as HTMLDivElement;
      if (buyBtn) {
        buyBtn.style.pointerEvents = '';
        buyBtn.style.opacity = '';
      }

      const radioButtons = Array.from(document.querySelectorAll('button[role="radio"]')) as HTMLButtonElement[];
      let domBtn: HTMLButtonElement | null = null;
      radioButtons.forEach(btn => {
        if (btn.textContent === 'DOM') domBtn = btn;
      });

      if (domBtn) {
        (domBtn as HTMLButtonElement).style.pointerEvents = '';
        (domBtn as HTMLButtonElement).style.opacity = '';
      }
    }
  }

  public toggleEnabled() {
    super.toggleEnabled();
    this.enforceLimitOnly();
  }
}
