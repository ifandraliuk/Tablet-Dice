import React from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { removeDiary } from "../../features/diary/diarySlice";
import Diary from "./index";

const mockNavigate = jest.fn();
jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../../features/diary/diarySlice", () => ({
  getUsers: () => ({ type: "users" }),
  getMyDiary: () => ({ type: "diary" }),
  postDiary: jest.fn(),
  editDiary: jest.fn(),
  removeDiary: jest.fn((id) => ({ type: "remove", id })),
}));
jest.mock("react-quill", () => () => null);

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  const me = { _id: "me", name: "Ich" };
  const state = {
    auth: { user: me },
    player: { fractionTheme: "Welles" },
    diaries: {
      userList: [me],
      diary: [{ _id: "note", category: "Personen", text: "Erinnerung", players: [me] }],
    },
  };
  useSelector.mockImplementation((selector) => selector(state));
});

function openDelete() {
  fireEvent.click(screen.getByRole("button", { name: "Eintrag löschen" }));
  return screen.getByRole("dialog", { name: "Eintrag löschen?" });
}

test("keeps the dialog open and prevents dismissal and repeated deletion until success", async () => {
  let resolveDelete;
  const pending = new Promise((resolve) => { resolveDelete = resolve; });
  const dispatch = jest.fn(() => ({ unwrap: () => pending }));
  useDispatch.mockReturnValue(dispatch);
  render(<Diary />);
  const dialog = openDelete();
  fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
  expect(removeDiary).toHaveBeenCalledTimes(1);
  expect(removeDiary).toHaveBeenCalledWith("note");
  expect(within(dialog).getByRole("button", { name: "Wird gelöscht …" })).toBeDisabled();
  expect(within(dialog).getByRole("button", { name: "Abbrechen" })).toBeDisabled();
  expect(within(dialog).queryByRole("button", { name: "Close" })).not.toBeInTheDocument();
  fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
  expect(screen.getByRole("dialog", { name: "Eintrag löschen?" })).toBeInTheDocument();
  await act(async () => { resolveDelete({ id: "note" }); await pending; });
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Eintrag löschen?" })).not.toBeInTheDocument());
});

test("shows errors, allows retry, and clears the error after success", async () => {
  const unwrap = jest.fn()
    .mockRejectedValueOnce("Server nicht erreichbar")
    .mockResolvedValueOnce({ id: "note" });
  useDispatch.mockReturnValue(() => ({ unwrap }));
  render(<Diary />);
  const dialog = openDelete();
  fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("Server nicht erreichbar");
  expect(screen.getByText("Erinnerung")).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Eintrag löschen?" })).not.toBeInTheDocument());
  expect(removeDiary).toHaveBeenCalledTimes(2);
  openDelete();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("offers a fallback error and lets the user cancel without deleting", async () => {
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.reject({}) }));
  render(<Diary />);
  const dialog = openDelete();
  fireEvent.click(within(dialog).getByRole("button", { name: "Löschen" }));
  expect(await within(dialog).findByRole("alert")).toHaveTextContent("Der Eintrag konnte nicht gelöscht werden.");
  fireEvent.click(within(dialog).getByRole("button", { name: "Abbrechen" }));
  await waitFor(() => expect(screen.queryByRole("dialog", { name: "Eintrag löschen?" })).not.toBeInTheDocument());
  expect(screen.getByText("Erinnerung")).toBeInTheDocument();
  openDelete();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
