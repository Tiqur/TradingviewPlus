// Custom button
const button = document.createElement('div');
button.id = 'tvp-menu-button';

// Div inside button
const innerDiv = document.createElement('div');

// Set svg
innerDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path transform="translate(2, 2)" fill-rule="nonzero" d="m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"></path></g></svg>'
button.appendChild(innerDiv);

innerDiv.addEventListener('click', e => {
  const tvp_menu = document.getElementById('tvp-menu');
  if (tvp_menu == null)
    injectSideMenu();
  else
    tvp_menu.remove();
})

waitForElm('#drawing-toolbar').then(() => {
  document.getElementById('drawing-toolbar')?.children[0].children[0].children[0].children[0].children[2].children[0].insertAdjacentElement('beforebegin', button);
});
