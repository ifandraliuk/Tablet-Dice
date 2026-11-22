export function clearSessionStorage() {
  const keys = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (key && !key.startsWith("craftingFavorites:")) keys.push(key);
  }
  keys.forEach((key) => localStorage.removeItem(key));
}
