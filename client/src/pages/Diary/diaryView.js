export const ALL_DIARY_CATEGORIES = "__all__";

export function matchesDiaryCategory(note, category) {
  return category === ALL_DIARY_CATEGORIES || note?.category === category;
}

export function diaryViewForPlayers(players) {
  return players.length > 1 ? "shared" : "mine";
}
