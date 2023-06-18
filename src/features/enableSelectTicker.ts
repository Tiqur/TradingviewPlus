document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 't') {
    (document.getElementById('header-toolbar-symbol-search') as HTMLElement).click();
  }
});
