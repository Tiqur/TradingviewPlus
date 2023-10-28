class ContextMenuListItem {
  name!: string;
  cb!: Function;
  element!: HTMLElement;

  constructor(name: string, cb: Function) {
    this.name = name;
    this.cb = cb;
    this.triggerAction = this.triggerAction.bind(this);
  }

  getName() {
    return this.name;
  }

  getElement() {
    const p = document.createElement('p');
    p.className = 'tpv-context-list-item';
    p.innerText = this.getName();
    this.element = p;
    this.registerEventListener();
    return this.element;
  }

  destroy() {
    this.removeEventListener();
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  registerEventListener() {
    this.element.addEventListener('click', this.triggerAction);
  }

  removeEventListener() {
    this.element.removeEventListener('click', this.triggerAction);
  }

  triggerAction() {
    this.cb();
  }
}
