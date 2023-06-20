interface Feature {
  name: string;
  tooltip: string;
  enabled: boolean;
  hotkey: Hotkey | null;
  category: 'Features' | 'Display' | 'Settings';
}
