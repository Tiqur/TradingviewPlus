function captureHotkey(cb: (result: Hotkey | 'cancel' | 'clear') => void) {
  let capturing = true;
  const CAPTURE = true;
  const hk: Hotkey = { key: '', ctrl:false, shift:false, alt:false, meta:false };
  let pressedBtn: number | null = null; // remember which mouse button started capture

  const cleanup = () => {
    if (!capturing) return;
    capturing = false;
    document.removeEventListener('keydown', onKeyDown, CAPTURE);
    document.removeEventListener('keyup', onKeyUp, CAPTURE);
    document.removeEventListener('wheel', onWheel, CAPTURE);
    document.removeEventListener('mousedown', onMouseDown, CAPTURE);
    document.removeEventListener('mouseup', onMouseUp, CAPTURE);
    document.removeEventListener('auxclick', onAuxClick, CAPTURE);
    document.removeEventListener('pointerup', onPointerUp, CAPTURE);
  };

  const finish = (res: Hotkey | 'cancel' | 'clear') => {
    if (!capturing) return;
    cleanup();
    cb(res);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault(); e.stopPropagation();
    hk.key = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
    hk.ctrl = e.ctrlKey; hk.shift = e.shiftKey; hk.alt = e.altKey; hk.meta = (e as any).metaKey;
    finish(hk);
  };

  const mapBtn = (b:number)=> b===0?'MouseLeft':b===1?'MouseMiddle':b===2?'MouseRight':b===3?'Mouse4':b===4?'Mouse5':null;

  const onMouseDown = (e: MouseEvent) => {
    const key = mapBtn(e.button); if (!key) return;
    e.preventDefault(); e.stopPropagation();
    pressedBtn = e.button;                 // arm release
    hk.key   = key;
    hk.ctrl  = e.ctrlKey; hk.shift = e.shiftKey; hk.alt = e.altKey; hk.meta = (e as any).metaKey;
    // do NOT finish here; wait for release to suppress navigation
  };

  const onMouseUp = (e: MouseEvent) => {
    // Only finish if this is the same button that started capture
    if (pressedBtn === null || e.button !== pressedBtn) return;
    e.preventDefault(); e.stopPropagation();
    finish(hk);
  };

  const onAuxClick = (e: MouseEvent) => {
    // Some Chromium builds fire auxclick on release; keep suppressing
    if (pressedBtn !== null) { e.preventDefault(); e.stopPropagation(); }
  };

  const onPointerUp = (e: PointerEvent) => {
    // Extra belt-and-suspenders for implementations that gate on pointer events
    if (pressedBtn !== null) { e.preventDefault(); e.stopPropagation(); }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return finish('cancel'); }
    if (e.key === 'Delete') { e.preventDefault(); e.stopPropagation(); return finish('clear'); }
    if (!['Meta','Shift','Control','Alt'].includes(e.key)) {
      e.preventDefault(); e.stopPropagation();
      hk.key   = e.key;
      hk.ctrl  = e.ctrlKey; hk.shift = e.shiftKey; hk.alt = e.altKey; hk.meta = e.metaKey;
    }
  };

  const onKeyUp = () => finish(hk);

  document.addEventListener('keydown',   onKeyDown,   CAPTURE);
  document.addEventListener('keyup',     onKeyUp,     CAPTURE);
  document.addEventListener('wheel',     onWheel,     CAPTURE);
  document.addEventListener('mousedown', onMouseDown, CAPTURE);
  document.addEventListener('mouseup',   onMouseUp,   CAPTURE);
  document.addEventListener('auxclick',  onAuxClick,  CAPTURE);
  document.addEventListener('pointerup', onPointerUp, CAPTURE);
}
