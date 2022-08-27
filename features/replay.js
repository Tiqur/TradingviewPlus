function enableReplayHotkey(key) {
  document.addEventListener('keydown', e => {
    if (e.key === key) {
      document.getElementById('header-toolbar-replay').click();
    }
  });
}
