function fuzzySearch(searchKey: string, featureName: string) {
  const skl = searchKey.toLowerCase();
  const fnl = featureName.toLowerCase();

  const nlen = searchKey.length;
  const hlen = featureName.length;

  if (nlen > hlen) {
    return false;
  }
  
  if (nlen === hlen) {
    return skl === fnl;
  }

  outer:
  for (var i = 0, j = 0; i < nlen; i++) {
    const nch = skl.charCodeAt(i);
    while (j < hlen) {
      if (fnl.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}
