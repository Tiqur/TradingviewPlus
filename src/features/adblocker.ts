
class AdBlocker extends FeatureClass {
  init() {
    console.log("Not implemented yet");
  }
}

features['Ad-Blocker'] = new AdBlocker({
  name: 'Ad-Blocker ( under development )',
  tooltip: 'Blocks Ads + Pop-Ups',
  enabled: false,
  hotkey: {
    key: null,
    alt: false,
    shift: false,
    ctrl: true,
    meta: false
  },
  category: 'Features'
});
