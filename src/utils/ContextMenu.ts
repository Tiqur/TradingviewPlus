class ContextMenu {
  position: [number, number];
  element!: HTMLElement;
  destroyMenuStack: [Function] = [() => {}];
  private clickCallback: (event: MouseEvent) => void;


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

  listenForOutsideClicks() {
    document.addEventListener('mousedown', this.defaultClickCallback);
  }

  removeOutsideClickListener() {
    document.removeEventListener('mousedown', this.defaultClickCallback);
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    const menu = document.getElementById('tvp-menu');
    if (!menu) return container;

    this.element = container;
    container.className = 'contextMenu';
    
    // Calculate the width of the container without adding it to the DOM
    container.style.visibility = 'hidden';

    // If light mode, change menu background color
    if (isLightMode())
      container.classList.add('tvp-light');
    else
      if (container.classList.contains('tvp-light'))
        container.classList.remove('tvp-light');

    menu.appendChild(container);
    
    // Calculate the width
    const containerWidth = container.offsetWidth;
    
    const menuWidth = window.innerWidth - menu.getBoundingClientRect().x;
    if (this.position[0] + containerWidth > menuWidth) {
      this.position[0] -= containerWidth;
    }

    // Reset visibility and update position
    container.style.visibility = 'visible';
    container.style.left = this.position[0] + 'px';
    container.style.top = this.position[1] + 'px';

    menu?.appendChild(container);
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

  destroy() {
    // Go through and call each function in this.destroyMenuStack before destroying context menu element
    for (const cb of this.destroyMenuStack) {
      cb();
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.removeOutsideClickListener();
  }
}
