//class CopyPrice extends FeatureClass {
//  private mousePos: [number, number] = [0, 0];
//  init() {
//    // Keep track of mouse pos
//    document.addEventListener('mousemove', e => {this.mousePos = [e.clientX, e.clientY]});
//
//    document.addEventListener('keydown', e => {
//      if (this.checkTrigger(e) && this.isEnabled()) {
//        // Emit context menu event
//        document.getElementsByClassName('chart-gui-wrapper')[0].children[1].dispatchEvent(new MouseEvent('contextmenu', {"clientX": this.mousePos[0], "clientY": this.mousePos[1]}))
//
//        waitForElm('[data-label="true"]').then(e => {
//          const elements = document.querySelectorAll('[data-label="true"]');
//
//          // Loop through context menu to find "Copy price"
//          for (var i = 0; i < elements.length; i++) {
//            const el = elements[i] as HTMLElement;
//            if (el.innerText.includes("Copy price")) {
//              // Get price without read clipboard perms
//              const text = el.innerText;
//              const price = text.substring(text.indexOf("(")+1, text.lastIndexOf(")"));
//
//              // Click copy price
//              el.click();
//
//              snackBar(`Copied ${price} to clipboard`);
//              break;
//            }
//          }
//        })
//      }
//    });
//  }
//}
//
//new CopyPrice(menu_contents['Copy Price At Ticker']);
//
//
