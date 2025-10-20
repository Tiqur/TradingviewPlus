function checkDuplicateHotkeys(
  features: Map<string, Feature>,
  hotkey: Hotkey
):
  | { duplicate: true; reason: 'duplicate' | 'modifier_only' | 'unmappable' }
  | false {
  // reject modifier-only bindings (including Meta alone)
  const modifierOnly =
    !hotkey.key || ['Shift', 'Control', 'Alt', 'Meta'].includes(hotkey.key);
  if (modifierOnly) return { duplicate: true, reason: 'modifier_only' };

  // reject unmappable keys
  const unmappableKeys = ['Enter', ' ', 'Tab', 'CapsLock', 'ContextMenu'];
  const key = hotkey.key as string; // safe after modifierOnly check
  if (unmappableKeys.includes(key)) return { duplicate: true, reason: 'unmappable' };

  for (const [, featureValue] of features) {
    const existing = featureValue.getHotkey();
    if (!existing || !existing.key) continue;

    const sameKey   = existing.key.toLowerCase() === hotkey.key?.toLowerCase();
    const sameCtrl  = !!existing.ctrl  === !!hotkey.ctrl;
    const sameShift = !!existing.shift === !!hotkey.shift;
    const sameAlt   = !!existing.alt   === !!hotkey.alt;
    const sameMeta  = !!existing.meta  === !!hotkey.meta;

    if (sameKey && sameCtrl && sameShift && sameAlt && sameMeta)
      return { duplicate: true, reason: 'duplicate' };
  }
  return false;
}
