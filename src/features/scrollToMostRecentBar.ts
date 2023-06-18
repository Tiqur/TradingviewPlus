document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'r') {
    (document.querySelector('[d="M6.5 1.5l5 5.5-5 5.5M3 4l2.5 3L3 10"]')?.parentElement?.parentElement as HTMLElement).click();
    //snackBar('Scrolling to most recent candle...')
  }
});
