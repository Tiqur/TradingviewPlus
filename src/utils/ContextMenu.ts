class ContextMenu {
  position: [number, number];
  element!: HTMLElement;
  destroyMenuStack: [Function] = [() => {}];

  constructor(position: [number, number]) {
    this.position = position;
  }

  private handleOutsideClick = (event: MouseEvent) => {
    if (!this.element.contains(event.target as Node)) {
      this.destroy();
    }
  }

  buildElement() {
    // Build your context menu elements here.
  }

  listenForOutsideClicks() {
    document.addEventListener('mousedown', this.handleOutsideClick);
  }

  removeOutsideClickHandler() {
    document.removeEventListener('mousedown', this.handleOutsideClick);
  }

  render(): HTMLElement {
    const container = document.createElement('div');
    const menu = document.getElementById('tvp-menu');
    if (!menu) return container;

    this.element = container;
    container.className = 'contextMenu';
    
    // Calculate the width of the container without adding it to the DOM
    container.style.visibility = 'hidden';

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
      this.destroyMenuStack.push(li.destroy)
    }

    // Render the list of items in the context menu.
  }

  renderMenuContent(content: ContextMenuContent) {
    const container = this.render();
    // Render the menu content.
  }

  destroy() {
    // Go through and call each function in this.destroyMenuStack before destroying context menu element
    for (const cb of this.destroyMenuStack) {
      cb();
    }

    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.removeOutsideClickHandler();
  }
}
