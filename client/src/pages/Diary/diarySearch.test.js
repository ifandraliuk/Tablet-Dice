import { matchesDiarySearch } from "./diarySearch";

test("ignores missing and invalid dates while still searching text", () => {
  expect(matchesDiarySearch("<p>Erinnerung</p>", "15.03.2025")).toBe(false);
  expect(matchesDiarySearch("<p>Erinnerung</p>", "15.03.2025", "ungültig")).toBe(false);
  expect(matchesDiarySearch("<p>Erinnerung</p>", "erinnerung", "ungültig")).toBe(true);
});
