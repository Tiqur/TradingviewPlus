function runAfterInjection() {
  const pos = {x: 0, y: 0};
  const container = document.getElementById('tvp-menu');
  let mouseDown = false;
  let menuContainerWidth = container?.getBoundingClientRect().width;

  if (container && menuContainerWidth) {
    container.style.right = -menuContainerWidth+'px';
  }


  document.addEventListener('mousemove', e => {pos.x = e.clientX, pos.y = e.clientY});

  const handleContainer = document.getElementById("handle-container");
  console.log(handleContainer);

  handleContainer?.addEventListener('mousedown', e => {
    console.log('mousedown')
    mouseDown = true;
  });

  document.addEventListener('mouseup', e => {
    mouseDown = false;
  });

  document.addEventListener('mousemove', e => {
    if (mouseDown && container) {
      menuContainerWidth = window.innerWidth - e.clientX;
      if (menuContainerWidth > 400 && menuContainerWidth < window.innerWidth) {
        container.style.width = menuContainerWidth+'px';
      } else {
        menuContainerWidth = menuContainerWidth < 400 ? 400 : window.innerWidth;
        container.style.width = menuContainerWidth+'px';
      }
    }
  })
}
