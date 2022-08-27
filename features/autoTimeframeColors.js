function enableAutoTimeframeColors() {
  // Wait for chart to exist
  waitForElm('.chart-gui-wrapper').then(async (e) => {
    // On canvas click
    document.getElementsByClassName("chart-gui-wrapper")[0].children[1].addEventListener('mousedown', async () => {

      // Close menus
      arrowActive = true;
      colorPicker.remove();
      configMenu.remove();

      if (!active) return;

      // Get current timeframe
      const currentTimeframe = [].slice.call(document.querySelector('[id="header-toolbar-intervals"]').children).filter(e => e.className.includes('isActive'))[0].innerText;

      // Wait for toolbar
      waitForElm('.floating-toolbar-react-widgets__button').then((e) => {
        // Click Line tool colors on toolbar
        document.querySelector('[data-name="line-tool-color"]').click()
        const colorBox = document.querySelector('[data-name="menu-inner"]').children[0];
        const allColors = [...[].slice.call(colorBox.children[0].children), ...[].slice.call(colorBox.children[1].children)];
        console.log(currentTimeframe)
        allColors[timeframeConfig.get(currentTimeframe)].click();
      })
    });
  })
}
