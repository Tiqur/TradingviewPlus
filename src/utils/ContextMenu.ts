class ContextMenu {
  position: [number, number];
  element!: HTMLElement;
  destroyMenuStack: [Function] = [() => {}];
  private clickCallback: (event: MouseEvent) => void;

  // Opened from a row of the TVP menu's list: moves with that row when the list scrolls
  private list: Element | null = null;
  private lastScrollTop = 0;
  private followList = () => {
    if (!this.list) return;
    this.position[1] -= this.list.scrollTop - this.lastScrollTop;
    this.lastScrollTop = this.list.scrollTop;
    this.element.style.top = this.position[1] + 'px';
  };


  constructor(position: [number, number]) {
    this.position = position;
    this.clickCallback = this.defaultClickCallback;
  }

  private defaultClickCallback = (event: MouseEvent) => {
    if (!this.element.contains(event.target as Node)) {
      this.destroy();
    }
  }

  public setClickCallback(callback: (event: MouseEvent) => void): void {
    this.clickCallback = callback;
    document.removeEventListener('mousedown', this.defaultClickCallback);
    document.addEventListener('mousedown', (event) => {
      callback(event);
      document.removeEventListener('mousedown', callback);
    });
  }

  updatePosition(position: [number, number]) {
    this.position = position;
    this.element.style.left = this.position[0] + 'px';
    this.element.style.top = this.position[1] + 'px';
  }

  listenForOutsideClicks() {
    document.addEventListener('mousedown', this.defaultClickCallback);
  }

  removeOutsideClickListener() {
    document.removeEventListener('mousedown', this.defaultClickCallback);
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    this.element = container;
    container.className = 'contextMenu';
    
    // Ensure it overlays over everything by appending to body and fixing position
    container.style.position = 'fixed';
    
    // Calculate the width of the container without adding it to the DOM
    container.style.visibility = 'hidden';

    // If light mode, change menu background color
    if (isLightMode())
      container.classList.add('tvp-light');
    else
      if (container.classList.contains('tvp-light'))
        container.classList.remove('tvp-light');
    
    document.body.appendChild(container);

    // Calculate the width
    const containerWidth = container.offsetWidth;
    const menuWidth = window.innerWidth;
    
    if (this.position[0] + containerWidth > menuWidth) {
      this.position[0] -= containerWidth;
    }

    // Reset visibility and update position
    container.style.visibility = 'visible';
    container.style.left = this.position[0] + 'px';
    container.style.top = this.position[1] + 'px';

    this.list = document.querySelector('#tvp-menu section');
    this.lastScrollTop = this.list?.scrollTop ?? 0;
    this.list?.addEventListener('scroll', this.followList);

    this.listenForOutsideClicks();

    return container;
  }

  renderList(listItems: ContextMenuListItem[]) {
    const container = this.render();
      
    for (const li of listItems) {
      container.appendChild(li.getElement());
      this.destroyMenuStack.push(li.destroy.bind(li))
      li.destroyParent = () => {this.destroy()};
    }

    // Render the list of items in the context menu.
  }

  renderElement(element: HTMLElement) {
    const container = this.render();
    //container.innerHTML = "";
    container.appendChild(element)
  }

  hide() {
    if (this.element)
      this.element.hidden = true;
  }

  show() {
    if (this.element)
      this.element.hidden = false;
  }

  destroy() {
    // Go through and call each function in this.destroyMenuStack before destroying context menu element
    for (const cb of this.destroyMenuStack) {
      cb();
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.removeOutsideClickListener();
    this.list?.removeEventListener('scroll', this.followList);
  }
}
