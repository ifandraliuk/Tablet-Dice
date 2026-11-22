export function diaryViewForPlayers(players) {
  return players.length > 1 ? "shared" : "mine";
}
