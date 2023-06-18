document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'a') {
    (document.querySelector('[data-name="auto"]') as HTMLElement).click();
    //snackBar('Toggled Auto Scale');
  }
});
