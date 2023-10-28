class ContextMenu {
  position: [number, number];
  element!: HTMLElement;

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

  render() {
    const container = document.createElement('div');
    const menu = document.getElementById('tvp-menu');
    if (!menu || !container) return;

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
  }

  renderList(listItems: ContextMenuListItem[]) {
    // Render the list of items in the context menu.
  }

  renderMenu(content: ContextMenuContent) {
    // Render the menu content.
  }

  destroy() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.removeOutsideClickHandler();
  }
}
