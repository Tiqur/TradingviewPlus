document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() != 'd') return;
      (document.querySelector('[data-name="remove"]') as HTMLElement).click()
});
