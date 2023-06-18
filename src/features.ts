const menu_contents: Record<string, Feature> = {
  'Auto Timeframe Colors': {
    name: 'Auto Timeframe Colors TOFIX',
    tooltip: 'Automatically changes tool color on click',
    enabled: true,
    hotkey: {
      key: 's',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Change Line Style': {
    name: 'Change Line Style',
    tooltip: 'Scrolls line styles ( solid, dashed, dotted )',
    enabled: true,
    hotkey: {
      key: 'q',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Change Line Width': {
    name: 'Change Line Width',
    tooltip: 'Scrolls line width ( 1px, 2px, 3px, 4px )',
    enabled: true,
    hotkey: {
      key: 'w',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Toggle Auto Scale': {
    name: 'Toggle Auto Scale',
    tooltip: 'Toggles the chart\'s "Auto" scale',
    enabled: true,
    hotkey: {
      key: 'a',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Toggle Invert Scale': {
    name: 'Toggle Invert Scale',
    tooltip: 'Toggles the inversion of the price axis',
    enabled: true,
    hotkey: {
      key: 'e',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Toggle Replay Mode': {
    name: 'Toggle Replay Mode',
    tooltip: 'Toggles replay mode ( must have pro plan or higher )',
    enabled: true,
    hotkey: {
      key: 't',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Copy Price At Ticker': {
    name: 'Copy Price At Ticker',
    tooltip: 'Copies price at cursor position',
    enabled: true,
    hotkey: {
      key: 'c',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Delete Drawing': {
    name: 'Delete Drawing',
    tooltip: 'Deletes currently selected drawing',
    enabled: true,
    hotkey: {
      key: 'd',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Scroll To Most Recent Bar': {
    name: 'Scroll To Most Recent Bar',
    tooltip: 'Scrolls to to most recent candle',
    enabled: true,
    hotkey: {
      key: 'f',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Scroll time left': {
    name: 'Scroll time left',
    tooltip: 'Scrolls backward in time',
    enabled: true,
    hotkey: {
      key: 'x',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Scroll time right': {
    name: 'Scroll time right',
    tooltip: 'Scrolls forward in time',
    enabled: true,
    hotkey: {
      key: 'x',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Scroll Timeframes': {
    name: 'Scroll Timeframes',
    tooltip: 'Allows you to scroll through timeframes using a hotkey + the scroll wheel',
    enabled: true,
    hotkey: {
      key: 'Tab',
      alt: false,
      shift: false,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Scroll Price Scale': {
    name: 'Scroll Price Scale',
    tooltip: 'Allows you to scroll the price scale using a hotkey + the scroll wheel',
    enabled: true,
    hotkey: {
      key: null,
      alt: false,
      shift: true,
      ctrl: false,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Zoom Both Axes': {
    name: 'Zoom Both Axes',
    tooltip: 'Zooms both time and pice axes at the same time',
    enabled: true,
    hotkey: {
      key: null,
      alt: false,
      shift: true,
      ctrl: true,
      meta: false
    },
    category: 'Features',
    action: () => {}
  },
  'Ad-Blocker ( under development )': {
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
    category: 'Features',
    action: () => {}
  },
};
