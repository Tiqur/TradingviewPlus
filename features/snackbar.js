function snackBar(text) {
  const css = `
  #snackbar {
    left: 50%;
    transform: translateX(-50%);
    visibility: hidden;
    position: fixed;
    margin-top: 2em;
  }

  #snackbar.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
    animation: fadein 0.5s, fadeout 0.5s 2.5s;
  }

  @-webkit-keyframes fadein {
    from {margin-top: 0; opacity: 0;} 
    to {margin-top: 2em; opacity: 1;}
  }

  @keyframes fadein {
    from {margin-top: 0; opacity: 0;}
    to {margin-top: 2em; opacity: 1;}
  }

  @-webkit-keyframes fadeout {
    from {margin-top: 2em; opacity: 1;} 
    to {margin-top: 0; opacity: 0;}
  }

  @keyframes fadeout {
    from {margin-top: 2em; opacity: 1;}
    to {margin-top: 0; opacity: 0;}
  }`;

  // Inject css keyframes
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

  const snackContainer = document.createElement('div');
  snackContainer.setAttribute('id', 'snackbar')
  snackContainer.setAttribute('class', 'show')
  setTimeout(() => snackContainer.setAttribute('class', ''), 3000)

  const snack = document.createElement('div');
  snack.setAttribute('style', 'background: #2962ff; padding: 1em 2em 1em 2em; margin-top: 2em; border-radius: 4px; display: flex; justify-content: center; align-items: center;');
  snack.innerHTML = `<p>${text}</p>`;
  snackContainer.appendChild(snack);

  document.getElementById('overlap-manager-root').appendChild(snackContainer);
}

