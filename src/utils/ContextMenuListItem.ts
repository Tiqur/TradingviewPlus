class ContextMenuListItem {
  name!: string;
  cb!: Function;
  element!: HTMLElement;

  constructor(name: string, cb: Function) {
    this.name = name;
    this.cb = cb;
  }

  getName() {
    return this.name;
  }

  getElement() {
    const p = document.createElement('p');
    p.innerText = this.getName();
    this.element = p;
    this.registerEventListener();
    return this.element;
  }

  registerEventListener() {
    this.element.addEventListener('click', this.triggerAction);
  }

  removeEventListener() {
    this.element.removeEventListener('click', this.triggerAction);
  }

  triggerAction() {
    console.log("trigger");
    this.cb();
  }
}
