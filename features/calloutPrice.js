function enableCalloutPriceHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[0].children[1].children[0].children[0].children[1].click();
      document.querySelector('[data-name="LineToolHorzLine"]').click();
      document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('mousedown', {"clientX": 0, "clientY": 0}))
      document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('mouseup', {"clientX": 0, "clientY": 0}))

      waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
        // Click settings button on toolbar
        document.querySelector('.floating-toolbar-react-widgets [data-name="settings"]').click();
      })

      //document.getElementById('drawing-toolbar').children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[1].click();
      //document.querySelector('[data-name="cursor"]').click();

      //document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('mousedown', {"clientX": 0, "clientY": 0}))
      //document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('mouseup', {"clientX": 0, "clientY": 0}))
      //document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('mousedown', {"clientX": 0, "clientY": 0}))
      //document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('mouseup', {"clientX": 0, "clientY": 0}))

     // // Wait for toolbar
     // waitForElm('.floating-toolbar-react-widgets').then((e) => {
     //   // Click settings button on toolbar
     //   document.querySelector('.floating-toolbar-react-widgets [data-name="settings"]').click();
     // })
    }
  });
}
