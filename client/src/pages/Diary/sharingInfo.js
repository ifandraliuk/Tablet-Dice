function playerId(player) {
  const id = typeof player === "object" && player !== null
    ? player._id ?? player.id
    : player;
  return id == null ? null : String(id);
}

export function getSharingInfo(players, userId) {
  const participants = Array.isArray(players) ? players : [];
  const currentUserId = userId == null ? null : String(userId);
  const includesCurrentUser = currentUserId !== null &&
    participants.some((player) => playerId(player) === currentUserId);
  const others = includesCurrentUser
    ? participants.filter((player) => playerId(player) !== currentUserId)
    : participants;

  if (!includesCurrentUser) {
    return {
      label: `Teilnehmer: ${participants.length}`,
      heading: "Teilnehmer",
      players: participants,
    };
  }

  const count = others.length;
  return {
    label: count === 0 ? "Nur du" : `${count} Mitspieler`,
    heading: count === 0 ? "Sichtbarkeit" : "Geteilt mit",
    players: others,
  };
}
