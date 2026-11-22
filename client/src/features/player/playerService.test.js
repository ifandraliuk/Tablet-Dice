import axios from "axios";
import playerService from "./playerService";

jest.mock("axios", () => ({ put: jest.fn() }));

test("sends attribute increases to the authenticated attribute route", async () => {
  axios.put.mockResolvedValue({ data: { attr: "strength", value: 8, pointsLeft: 13 } });
  await expect(playerService.updateAttribute("strength", "test-token")).resolves.toEqual({
    attr: "strength",
    value: 8,
    pointsLeft: 13,
  });
  expect(axios.put).toHaveBeenCalledWith(
    "/attributes/strength",
    null,
    { headers: { Authorization: "Bearer test-token" } }
  );
});
