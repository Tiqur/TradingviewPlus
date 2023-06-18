document.addEventListener('keydown', e => {
  if (!/^[0-9]$/i.test(e.key)) return;
  (document.getElementsByClassName('tv-floating-toolbar__content')[0].children[e.key as any-1].children[0] as HTMLElement).click()
});
