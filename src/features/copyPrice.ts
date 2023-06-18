// Store mouse pos
let mousePos: [number, number] = [0, 0];

// Keep track of mouse pos
document.addEventListener('mousemove', e => {mousePos = [e.clientX, e.clientY]});


document.addEventListener('keydown', e => {
  if (e.key.toLowerCase() === 'c') {
    // Emit context menu event
    document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('contextmenu', {"clientX": mousePos[0], "clientY": mousePos[1]}))

    waitForElm('[data-label="true"]').then(e => {
      const elements = document.querySelectorAll('[data-label="true"]');

      // Loop through context menu to find "Copy price"
      for (var i = 0; i < elements.length; i++) {
        const el = elements[i] as HTMLElement;
        if (el.innerText.includes("Copy price")) {
          // Get price without read clipboard perms
          const text = el.innerText;
          const price = text.substring(text.indexOf("(")+1, text.lastIndexOf(")"));

          // Click copy price
          el.click();

          snackBar(`Copied ${price} to clipboard`);
          break;
        }
      }
    })
  }
});
