function enableReplayHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      document.getElementById('header-toolbar-replay').click();
      snackBar(`Replay mode is now ${document.getElementById('header-toolbar-replay').className.includes('isActive')}`);
    }
  });
}
