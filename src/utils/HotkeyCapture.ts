// No imports/exports. Keep global like rest of codebase.

function captureHotkey(cb: (result: Hotkey | 'cancel' | 'clear') => void) {
  let capturing = true;
  const CAPTURE = true;
  const hk: Hotkey = { key: '', ctrl:false, shift:false, alt:false, meta:false };

  const cleanup = () => {
    if (!capturing) return;
    capturing = false;
    document.removeEventListener('keydown', onKeyDown, CAPTURE);
    document.removeEventListener('keyup', onKeyUp, CAPTURE);
    document.removeEventListener('wheel', onWheel, CAPTURE);
    document.removeEventListener('mousedown', onMouseDown, CAPTURE);
  };

  const finish = (res: Hotkey | 'cancel' | 'clear') => {
    if (!capturing) return;
    cleanup();
    cb(res);
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault(); e.stopPropagation();
    hk.key   = e.deltaY < 0 ? 'WheelUp' : 'WheelDown';
    hk.ctrl  = e.ctrlKey; hk.shift = e.shiftKey; hk.alt = e.altKey; hk.meta = (e as any).metaKey;
    finish(hk);
  };

  const onMouseDown = (e: MouseEvent) => {
    const mapBtn = (b:number)=> b===0?'MouseLeft':b===1?'MouseMiddle':b===2?'MouseRight':b===3?'Mouse4':b===4?'Mouse5':null;
    const key = mapBtn(e.button); if (!key) return;
    e.preventDefault(); e.stopPropagation();
    hk.key   = key;
    hk.ctrl  = e.ctrlKey; hk.shift = e.shiftKey; hk.alt = e.altKey; hk.meta = (e as any).metaKey;
    finish(hk);
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

  document.addEventListener('keydown', onKeyDown, CAPTURE);
  document.addEventListener('keyup',   onKeyUp,   CAPTURE);
  document.addEventListener('wheel',   onWheel,   CAPTURE);
  document.addEventListener('mousedown', onMouseDown, CAPTURE);
}
