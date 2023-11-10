function checkDuplicateHotkeys(features: Map<string, Feature>, hotkey: Hotkey): boolean {
  for (const [featureKey, featureValue] of features) {
    const key = featureValue.getHotkey().key;
    if (key?.toLowerCase() === hotkey.key?.toLowerCase()) {
      return true;
    }
  }
  return false;
}
