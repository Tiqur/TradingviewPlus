//const scrollToMostRecentBarKeyboardEventObj = {
//  'keyCode': 39, 'altKey': true, 'shiftKey': true, 'bubbles': true, 'code': 'custom'
//}
//
//class ScrollToMostRecentBar extends FeatureClass {
//  init() {
//    document.addEventListener('keydown', e => {
//      if (this.checkTrigger(e) && this.isEnabled()) {
//        document.dispatchEvent(new KeyboardEvent('keydown', scrollToMostRecentBarKeyboardEventObj));
//        document.dispatchEvent(new KeyboardEvent('keyup', scrollToMostRecentBarKeyboardEventObj));
//
//        //snackBar('Scrolling to most recent candle...')
//      }
//    });
//  }
//}
//
//new ScrollToMostRecentBar(menu_contents['Scroll To Most Recent Bar']);
//
//
