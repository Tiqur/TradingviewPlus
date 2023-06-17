const menu_contents: Record<string, Feature> = {
  'Auto Timeframe Colors': {
    name: 'Auto Timeframe Colors',
    tooltip: 'Automatically changes tool color on click',
    enabled: true,
    hotkey: ['s'],
    category: 'features',
    action: () => {}
  },
  'Change Line Style': {
    name: 'Change Line Style',
    tooltip: 'Scrolls line styles ( solid, dashed, dotted )',
    enabled: true,
    hotkey: ['q'],
    category: 'features',
    action: () => {}
  },
  'Change Line Width': {
    name: 'Change Line Width',
    tooltip: 'Scrolls line width ( 1px, 2px, 3px, 4px )',
    enabled: true,
    hotkey: ['w'],
    category: 'features',
    action: () => {}
  },
  'Toggle Auto Scale': {
    name: 'Toggle Auto Scale',
    tooltip: 'Toggles the chart\'s "Auto" scale',
    enabled: true,
    hotkey: ['a'],
    category: 'features',
    action: () => {}
  },
  'Toggle Invert Scale': {
    name: 'Toggle Invert Scale',
    tooltip: 'Toggles the inversion of the price axis',
    enabled: true,
    hotkey: ['e'],
    category: 'features',
    action: () => {}
  },
  'Toggle Replay Mode': {
    name: 'Toggle Replay Mode',
    tooltip: 'Toggles replay mode ( must have pro plan or higher )',
    enabled: true,
    hotkey: ['t'],
    category: 'features',
    action: () => {}
  },
  'Copy Price At Ticker': {
    name: 'Copy Price At Ticker',
    tooltip: 'Copies price at cursor position',
    enabled: true,
    hotkey: ['c'],
    category: 'features',
    action: () => {}
  },
  'Delete Drawing': {
    name: 'Delete Drawing',
    tooltip: 'Deletes currently selected drawing',
    enabled: true,
    hotkey: ['d'],
    category: 'features',
    action: () => {}
  },
  'Scroll To Most Recent Bar': {
    name: 'Scroll To Most Recent Bar',
    tooltip: 'Scrolls to to most recent candle',
    enabled: true,
    hotkey: ['f'],
    category: 'features',
    action: () => {}
  },
  'Scroll time left': {
    name: 'Scroll time left',
    tooltip: 'Scrolls backward in time',
    enabled: true,
    hotkey: ['x'],
    category: 'features',
    action: () => {}
  },
  'Scroll time right': {
    name: 'Scroll time right',
    tooltip: 'Scrolls forward in time',
    enabled: true,
    hotkey: ['x'],
    category: 'features',
    action: () => {}
  },
  'Scroll Timeframes': {
    name: 'Scroll Timeframes',
    tooltip: 'Allows you to scroll through timeframes using a hotkey + the scroll wheel',
    enabled: true,
    hotkey: ['Tab'],
    category: 'features',
    action: () => {}
  },
  'Scroll Price Scale': {
    name: 'Scroll Price Scale',
    tooltip: 'Allows you to scroll the price scale using a hotkey + the scroll wheel',
    enabled: true,
    hotkey: ['Shift'],
    category: 'features',
    action: () => {}
  },
  'Zoom Both Axes': {
    name: 'Zoom Both Axes',
    tooltip: 'Zooms both time and pice axes at the same time',
    enabled: true,
    hotkey: ['Shift', 'Ctrl'],
    category: 'features',
    action: () => {}
  },
  'Ad-Blocker ( under development )': {
    name: 'Ad-Blocker ( under development )',
    tooltip: 'Blocks Ads + Pop-Ups',
    enabled: false,
    'hotkey': null,
    category: 'features',
    action: () => {}
  },
};
