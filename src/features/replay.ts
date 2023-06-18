document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'r') {
    (document.getElementById('header-toolbar-replay') as HTMLElement).click();
  }
});
