import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { editDiary, postDiary } from "../../features/diary/diarySlice";
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

test("searches across categories while keeping private and shared entries separate", () => {
  render(<Diary />);
  fireEvent.click(screen.getByRole("button", { name: "Alle Kategorien (4)" }));
  expect(screen.getByRole("tab", { name: "Private Einträge (3)" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tab", { name: "Gemeinsame Einträge (1)" })).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox", { name: "Einträge durchsuchen" }), { target: { value: "drache" } });
  expect(screen.getByText("Drache")).toBeInTheDocument();
  expect(screen.getByText("Drachenhöhle")).toBeInTheDocument();
  expect(screen.getByText("Drachenhöhle").closest("article")).toHaveTextContent("Orte");
  expect(screen.queryByText("Gemeinsamer Drache")).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox", { name: "Einträge durchsuchen" }), { target: { value: "15.03.2025" } });
  expect(screen.getByText("Drache")).toBeInTheDocument();
  expect(screen.getByText("Drachenhöhle")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox", { name: "Einträge durchsuchen" }), { target: { value: "drache" } });
  fireEvent.click(screen.getByRole("tab", { name: "Gemeinsame Einträge (1)" }));
  expect(screen.getByText("Gemeinsamer Drache")).toBeInTheDocument();
  expect(screen.queryByText("Drachenhöhle")).not.toBeInTheDocument();
});

test("saves a new entry in the last category when created from all categories", async () => {
  render(<Diary />);
  fireEvent.click(screen.getByRole("button", { name: "Orte (1)" }));
  fireEvent.click(screen.getByRole("button", { name: "Alle Kategorien (4)" }));
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Neuer Ort" } });
  fireEvent.click(screen.getByRole("button", { name: "Speichern" }));
  await waitFor(() => expect(postDiary).toHaveBeenCalledWith({
    text: "Neuer Ort", category: "Orte", players: ["me"],
  }));
  await waitFor(() => expect(localStorage.getItem("diary-active-category")).toBe("Orte"));
});

test("preserves an entry's category when editing in the all-categories view", async () => {
  render(<Diary />);
  fireEvent.click(screen.getByRole("button", { name: "Alle Kategorien (4)" }));
  const card = screen.getByText("Drachenhöhle").closest("article");
  expect(card.querySelector(".diary-note__details").firstElementChild).toHaveTextContent("Orte");
  fireEvent.click(within(card).getByRole("button", { name: "Eintrag bearbeiten" }));
  expect(screen.getByText("Orte")).toBeInTheDocument();
  expect(document.querySelector(".diary-note--editing .diary-note__details").firstElementChild).toHaveTextContent("Orte");
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Andere Höhle" } });
  fireEvent.click(screen.getByTitle("Speichern"));
  await waitFor(() => expect(editDiary).toHaveBeenCalledWith({
    id: "4", data: { text: "Andere Höhle", players: ["me"], category: "Orte" },
  }));
});

test("uses the last concrete category when creating from the all-categories view", () => {
  const { unmount } = render(<Diary />);
  fireEvent.click(screen.getByRole("button", { name: "Orte (1)" }));
  fireEvent.click(screen.getByRole("button", { name: "Alle Kategorien (4)" }));
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  expect(screen.getByLabelText("Kategorie")).toHaveValue("Orte");
  fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
  expect(screen.queryByRole("dialog", { name: "Änderungen verwerfen?" })).not.toBeInTheDocument();
  expect(localStorage.getItem("diary-last-category")).toBe("Orte");
  unmount();
  render(<Diary />);
  expect(screen.getByRole("button", { name: "Alle Kategorien (4)" })).toHaveAttribute("aria-pressed", "true");
  fireEvent.click(screen.getByTitle("Neue Notiz"));
  expect(screen.getByLabelText("Kategorie")).toHaveValue("Orte");
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
