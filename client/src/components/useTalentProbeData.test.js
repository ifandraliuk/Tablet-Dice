import { act, renderHook, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import useTalentProbeData from "./useTalentProbeData";

jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("../features/player/playerSlice", () => ({ getAttributes: () => ({ type: "attributes" }) }));
jest.mock("../features/inventory/inventorySlice", () => ({ getCategoryBoni: () => ({ type: "boni" }) }));

test("reports loading failures and retries without treating missing bonuses as zero", async () => {
  const attributes = { vitality: 10 };
  useSelector.mockImplementation((selector) => selector({ player: { attributes } }));
  let fails = true;
  const dispatch = (action) => ({
    unwrap: () => action.type === "attributes"
      ? Promise.resolve({ attributes })
      : fails ? Promise.reject(new Error("Netzwerkfehler")) : Promise.resolve({ boni: [] }),
  });
  useDispatch.mockReturnValue(dispatch);
  const user = { _id: "hero" };
  const { result } = renderHook(() => useTalentProbeData(user));
  await waitFor(() => expect(result.current.error).toBe("Netzwerkfehler"));
  expect(result.current.boni).toBeNull();
  expect(result.current.attributes).toBeNull();
  fails = false;
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.boni).toEqual([]));
  expect(result.current.error).toBe("");
  expect(result.current.attributes).toEqual(attributes);
});
