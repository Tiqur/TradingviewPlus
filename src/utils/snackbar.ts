function snackBar(text: string) {
  const snackContainer = document.createElement('div');
  snackContainer.innerText = text;
  const msVisible = 3000;

  snackContainer.id = 'tvp-snackbar';
  snackContainer.className = 'show';
  setTimeout(() => {snackContainer.className = ''}, msVisible);
  setTimeout(() => {snackContainer.remove()}, 2500);


  document.body.appendChild(snackContainer);
}
