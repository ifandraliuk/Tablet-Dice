import { formatDiaryDate } from "./diaryDate";

export function matchesDiarySearch(html, search, createdAt) {
  const query = search.trim().toLocaleLowerCase("de-DE");
  if (!query) return true;

  const content = document.createElement("div");
  content.innerHTML = html || "";
  const date = formatDiaryDate(createdAt);
  return content.textContent.toLocaleLowerCase("de-DE").includes(query) ||
    Boolean(date && date.includes(query));
}
