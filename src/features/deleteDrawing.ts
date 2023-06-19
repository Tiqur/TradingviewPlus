class DeleteDrawing extends FeatureClass {
  init() {
    document.addEventListener('keydown', e => {
      if (this.checkTrigger(e) && this.isEnabled()) {
        (document.querySelector('[data-name="remove"]') as HTMLElement).click()
      }
    });
  }
}

features['Delete Drawing'] = new DeleteDrawing({
  name: 'Delete Drawing',
  tooltip: 'Deletes currently selected drawing',
  enabled: true,
  hotkey: {
    key: 'd',
    alt: false,
    shift: false,
    ctrl: false,
    meta: false
  },
  category: 'Features',
  action: () => {}
});
console.log(features);

