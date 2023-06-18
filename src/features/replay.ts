function enableReplayHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === key) {
      document.getElementById('header-toolbar-replay').click();
    }
  });
}
