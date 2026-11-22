export function hasDraftContent(value) {
  const element = document.createElement("div");
  element.innerHTML = String(value || "");
  return Boolean(element.textContent.trim() || element.querySelector("img, video, iframe"));
}

export function samePlayers(first, second) {
  const sortedSecond = [...second].sort();
  return first.length === second.length &&
    [...first].sort().every((id, index) => id === sortedSecond[index]);
}
