import { getSharingInfo } from "./sharingInfo";

test("counts other participants without modifying the original list", () => {
  const players = [{ id: "me", name: "Ich" }, { _id: "one", name: "Eins" }, "two"];
  const result = getSharingInfo(players, "me");
  expect(result.label).toBe("2 Mitspieler");
  expect(result.players).toEqual([players[1], "two"]);
  expect(players).toHaveLength(3);
  expect(getSharingInfo(["me", "one"], "me").label).toBe("1 Mitspieler");
  expect(getSharingInfo(["me"], "me").label).toBe("Nur du");
});

test("does not claim privacy when the current user is missing", () => {
  expect(getSharingInfo([], "me").label).toBe("Teilnehmer: 0");
  expect(getSharingInfo(["friend"], "me").label).toBe("Teilnehmer: 1");
  expect(getSharingInfo(["me"], undefined).label).toBe("Teilnehmer: 1");
});
