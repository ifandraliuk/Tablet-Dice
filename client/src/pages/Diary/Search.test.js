import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import Diary from "./index";

const mockNavigate = jest.fn();
const marchDate = new Date(2025, 2, 15, 12).toISOString();
const aprilDate = new Date(2025, 3, 10, 12).toISOString();
jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../../features/diary/diarySlice", () => ({
  getUsers: () => ({ type: "users" }),
  getMyDiary: () => ({ type: "diary" }),
  postDiary: jest.fn((data) => ({ type: "post", data })),
  editDiary: jest.fn((data) => ({ type: "edit", data })),
  removeDiary: jest.fn(),
}));
jest.mock("react-quill", () => ({ value, onChange }) => (
  <textarea aria-label="Notiztext" value={value} onChange={(event) => onChange(event.target.value)} />
));

beforeEach(() => {
  localStorage.clear();
  const me = { _id: "me", name: "Ich" };
  const state = {
    auth: { user: me },
    player: { fractionTheme: "Welles" },
    diaries: {
      userList: [{ id: "me", name: "Ich" }, { id: "friend", name: "Freund" }],
      diary: [
        { _id: "1", category: "Personen", text: "<p>Ein <strong>Drache</strong> &amp; Held</p>", players: [me], createdAt: marchDate },
        { _id: "2", category: "Personen", text: "Der Zwerg", players: [me], createdAt: aprilDate },
        { _id: "3", category: "Personen", text: "Gemeinsamer Drache", players: [me, { _id: "friend", name: "Freund" }], createdAt: marchDate },
        { _id: "4", category: "Orte", text: "Drachenhöhle", players: [me], createdAt: marchDate },
      ],
    },
  };
  useSelector.mockImplementation((selector) => selector(state));
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
});

test("searches visible text case-insensitively within the selected category and tab", () => {
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "  DRACHE  " } });
  expect(screen.getByText("Drache")).toBeInTheDocument();
  expect(screen.queryByText("Der Zwerg")).not.toBeInTheDocument();
  expect(screen.queryByText("Gemeinsamer Drache")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Gemeinsame Einträge (1)" }));
  expect(screen.getByText("Gemeinsamer Drache")).toBeInTheDocument();
  expect(screen.queryByText("Drachenhöhle")).not.toBeInTheDocument();
  fireEvent.change(search, { target: { value: "unbekannt" } });
  expect(screen.getByText("Keine Einträge für diese Suche gefunden.")).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "" } });
  expect(screen.getByText("Gemeinsamer Drache")).toBeInTheDocument();
});

test("does not match markup and decodes HTML entities", () => {
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "strong" } });
  expect(screen.getByText("Keine Einträge für diese Suche gefunden.")).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "&" } });
  expect(screen.getByText("Drache")).toBeInTheDocument();
});

test("searches the displayed creation date within the selected category and tab", () => {
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "15.03.2025" } });
  expect(screen.getByText("Drache")).toBeInTheDocument();
  expect(screen.queryByText("Der Zwerg")).not.toBeInTheDocument();
  expect(screen.queryByText("Gemeinsamer Drache")).not.toBeInTheDocument();
  expect(screen.queryByText("Drachenhöhle")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Gemeinsame Einträge (1)" }));
  expect(screen.getByText("Gemeinsamer Drache")).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "03.2025" } });
  expect(screen.getByText("Gemeinsamer Drache")).toBeInTheDocument();
  fireEvent.change(search, { target: { value: "16.03.2025" } });
  expect(screen.getByText("Keine Einträge für diese Suche gefunden.")).toBeInTheDocument();
});

test("keeps a matching date search after editing", async () => {
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "15.03.2025" } });
  fireEvent.click(screen.getByRole("button", { name: "Eintrag bearbeiten" }));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Andere Erinnerung" } });
  fireEvent.click(screen.getByTitle("Speichern"));
  await waitFor(() => expect(search).not.toBeDisabled());
  expect(search).toHaveValue("15.03.2025");
});

test("keeps a matching date search after creation", async () => {
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve({ createdAt: marchDate }) }));
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "15.03.2025" } });
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Neue Erinnerung" } });
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
  await waitFor(() => expect(screen.queryByRole("button", { name: "Speichern" })).not.toBeInTheDocument());
  expect(search).toHaveValue("15.03.2025");
});

test("keeps an edited entry visible and clears a stale search after saving", async () => {
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "drache" } });
  fireEvent.click(document.querySelector(".btn-edit"));
  expect(search).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Andere Erinnerung" } });
  fireEvent.click(screen.getByTitle("Speichern"));
  await waitFor(() => expect(search).toHaveValue(""));
  expect(search).not.toBeDisabled();
});

test("clears a stale search after a successful creation", async () => {
  render(<Diary />);
  const search = screen.getByRole("searchbox", { name: "Einträge durchsuchen" });
  fireEvent.change(search, { target: { value: "drache" } });
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Neue Erinnerung" } });
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
  await waitFor(() => expect(search).toHaveValue(""));
});
