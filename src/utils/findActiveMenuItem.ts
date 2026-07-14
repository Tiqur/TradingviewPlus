/**
 * Finds the index of the "active" item in a list of menu elements.
 * 
 * Strategy (in order of priority):
 *  1. Check for data-role="menuitem" active detection via class partial match ('active', 'isActive')
 *  2. Check aria-selected / aria-current attributes  
 *  3. Compare computed background-color or color via getComputedStyle — the active
 *     item visually differs from its siblings even if class names are hashed by React
 * 
 * This approach is immune to React-generated CSS class name suffix changes (e.g., isActive-jFqVJoPk).
 */
function findActiveMenuItem(items: Element[]): number {
  if (items.length === 0) return -1;

  // Method 1: Partial class name match for 'active' or 'isActive'
  // Use space-prefix check to avoid false matches like "interactive-xxx" containing "active-"
  const byClass = items.findIndex(el => {
    const cn = ' ' + (el as HTMLElement).className + ' '; // pad with spaces for word-boundary matching
    return cn.includes(' isActive') || cn.includes(' active-') || cn.includes(' isActive-');
  });
  if (byClass !== -1) return byClass;

  // Method 2: aria-selected / aria-current / aria-checked attribute
  const byAria = items.findIndex(el =>
    el.getAttribute('aria-selected') === 'true' ||
    el.getAttribute('aria-current') === 'true' ||
    el.getAttribute('aria-checked') === 'true' ||
    el.getAttribute('aria-pressed') === 'true'
  );
  if (byAria !== -1) return byAria;

  // Method 3: Compare computed background-color and color — active items render differently
  // Build a map of each items computed bg color and find the outlier
  const styles = items.map(el => {
    const s = getComputedStyle(el as HTMLElement);
    return { bg: s.backgroundColor, color: s.color };
  });

  // Count occurrences of each bg color
  const bgCounts: Record<string, number> = {};
  styles.forEach(s => { bgCounts[s.bg] = (bgCounts[s.bg] || 0) + 1; });

  // The active item is often the one with a unique/outlier background color
  if (Object.keys(bgCounts).length > 1) {
    const rareColor = Object.entries(bgCounts).sort((a, b) => a[1] - b[1])[0][0];
    const byBg = styles.findIndex(s => s.bg === rareColor);
    if (byBg !== -1) return byBg;
  }

  // Method 4: Check each element's children for an active indicator (space-padded to avoid interactive- match)
  const byChildClass = items.findIndex(el => {
    return Array.from(el.querySelectorAll('*')).some(child => {
      const cn = ' ' + (child as HTMLElement).className + ' ';
      return cn.includes(' isActive') || cn.includes(' active-') || cn.includes(' isActive-');
    });
  });
  if (byChildClass !== -1) return byChildClass;

  return -1;
}
