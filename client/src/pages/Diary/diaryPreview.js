export const DIARY_PREVIEW_LENGTH = 600;

export function diaryPreview(html) {
  const content = document.createElement("div");
  content.innerHTML = html || "";
  if (Array.from(content.textContent).length <= DIARY_PREVIEW_LENGTH) return null;

  const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT);
  let remaining = DIARY_PREVIEW_LENGTH;
  let node = walker.nextNode();
  while (node) {
    const characters = Array.from(node.data);
    if (characters.length >= remaining) {
      let prefix = characters.slice(0, remaining).join("");
      if (remaining < characters.length && /\S/u.test(characters[remaining - 1]) && /\S/u.test(characters[remaining])) {
        const partialWord = prefix.match(/\s+\S*$/u);
        if (partialWord && partialWord[0].length <= 40) {
          prefix = prefix.slice(0, -partialWord[0].length);
        }
      }
      const range = document.createRange();
      range.setStart(node, prefix.length);
      range.setEnd(content, content.childNodes.length);
      range.deleteContents();
      range.insertNode(document.createTextNode("…"));
      return content.innerHTML;
    }
    remaining -= characters.length;
    node = walker.nextNode();
  }
  return null;
}
