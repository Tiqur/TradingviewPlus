class DeleteDrawing extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.querySelector('[data-name="remove"]') as HTMLElement).click()
      }
    });
  }
}

new DeleteDrawing(menu_contents['Delete Drawing']);

