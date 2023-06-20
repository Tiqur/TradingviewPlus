const button = document.createElement('div');
button.id = 'tvp-menu-button';

waitForElm('#drawing-toolbar').then(() => {
  document.getElementById('drawing-toolbar')?.children[0].children[0].children[0].children[0].children[2].children[0].insertAdjacentElement('beforebegin', button);
});
