function enableToggleAutotimeframeColorsHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key === key) {
      // Toggle
      document.getElementById('tvp-custom-button').click();

      // Remove hover effect
      document.getElementById('tvp-custom-button').parentElement.dispatchEvent(new MouseEvent('mouseleave'));

      //snackBar('Toggled Auto-Timeframe Colors');
    }
  });
}
