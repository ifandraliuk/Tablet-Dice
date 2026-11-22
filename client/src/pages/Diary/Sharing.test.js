import React, { useState } from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useDispatch } from "react-redux";
import { editDiary } from "../../features/diary/diarySlice";
import ActiveDiaryCategory from "./ActiveDiaryPage";
import NotePopup from "./NotePopup";

jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("../../features/diary/diarySlice", () => ({ editDiary: jest.fn((data) => data) }));
jest.mock("react-quill", () => ({ value, onChange }) => (
  <textarea aria-label="Notiztext" value={value} onChange={(event) => onChange(event.target.value)} />
));

const user = { _id: "me", name: "Ich" };
const userList = [
  { id: "me", name: "Ich" },
  { id: "friend", name: "Freund" },
  { id: "other", name: "Andere" },
];
const note = {
  _id: "note",
  category: "Erlebtes",
  text: "Erinnerung",
  players: [{ _id: "me", name: "Ich" }, { _id: "friend", name: "Freund" }],
};

function CreateHarness() {
  const [share, setShare] = useState(["me"]);
  return (
    <NotePopup
      closeCreatePopup={jest.fn()}
      text="Erinnerung"
      setText={jest.fn()}
      user={user}
      userList={userList}
      share={share}
      shareWith={setShare}
      category="Personen"
      setCategory={jest.fn()}
      categories={["Personen", "Erlebtes"]}
      fractionTheme="Welles"
      handleCreatePopupSave={jest.fn()}
    />
  );
}

function renderEdit(setViewMode = jest.fn()) {
  render(
    <ActiveDiaryCategory
      diary={[note]}
      activeCategory="Erlebtes"
      onRemove={jest.fn()}
      user={user}
      userList={userList}
      fractionTheme="Welles"
      viewMode="shared"
      setViewMode={setViewMode}
    />
  );
  fireEvent.click(document.querySelector(".btn-edit"));
}

beforeEach(() => {
  jest.clearAllMocks();
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.resolve() }));
});

test("filters private and shared entries consistently within the selected category", () => {
  const entries = [
    { ...note, _id: "shared", text: "Gemeinsames Abenteuer" },
    { ...note, _id: "private", text: "Private Erinnerung", players: [user] },
    { ...note, _id: "other-category", category: "Orte", text: "Anderer Ort" },
  ];
  const props = {
    diary: entries,
    activeCategory: "Erlebtes",
    onRemove: jest.fn(),
    user,
    userList,
    fractionTheme: "Welles",
    setViewMode: jest.fn(),
  };
  const { rerender } = render(<ActiveDiaryCategory {...props} viewMode="mine" />);
  expect(screen.getByText("Private Erinnerung")).toBeInTheDocument();
  expect(screen.queryByText("Gemeinsames Abenteuer")).not.toBeInTheDocument();
  rerender(<ActiveDiaryCategory {...props} viewMode="shared" />);
  expect(screen.getByText("Gemeinsames Abenteuer")).toBeInTheDocument();
  expect(screen.queryByText("Private Erinnerung")).not.toBeInTheDocument();
  expect(screen.queryByText("Anderer Ort")).not.toBeInTheDocument();
});

test("switches to the private view after removing the last other participant", async () => {
  const setViewMode = jest.fn();
  renderEdit(setViewMode);
  expect(screen.getByRole("button", { name: "Freigabe bearbeiten: 1 Mitspieler" })).toBeInTheDocument();
  fireEvent.click(screen.getByTitle("Teilen"));
  fireEvent.click(screen.getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
  expect(screen.getByRole("button", { name: "Freigabe bearbeiten: Nur du" })).toBeInTheDocument();
  fireEvent.click(screen.getByTitle("Speichern"));
  await waitFor(() => expect(setViewMode).toHaveBeenCalledWith("mine"));
});

test("selects participants when creating and retains the selection when reopening", async () => {
  render(<CreateHarness />);
  fireEvent.click(screen.getByRole("button", { name: "Teilen mit 0 Mitspielern" }));
  const dialog = screen.getByRole("dialog", { name: "Notiz teilen" });
  fireEvent.click(within(dialog).getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(within(dialog).getByRole("button", { name: "Übernehmen" }));
  fireEvent.click(screen.getByRole("button", { name: "Teilen mit 1 Mitspieler" }));
  expect(screen.getByRole("checkbox", { name: /Freund/ })).toBeChecked();
});

test("preserves existing participants when editing without opening sharing", async () => {
  renderEdit();
  fireEvent.change(screen.getByLabelText("Notiztext"), { target: { value: "Neue Erinnerung" } });
  fireEvent.click(screen.getByTitle("Speichern"));
  await waitFor(() => expect(editDiary).toHaveBeenCalledWith({
    id: "note",
    data: { text: "Neue Erinnerung", players: ["me", "friend"], category: "Erlebtes" },
  }));
});

test("keeps confirmed changes on reopening and discards cancelled selection changes", async () => {
  renderEdit();
  fireEvent.click(screen.getByTitle("Teilen"));
  expect(screen.getByRole("checkbox", { name: /Freund/ })).toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: /Andere/ }));
  fireEvent.click(screen.getByRole("button", { name: "Übernehmen" }));
  fireEvent.click(screen.getByTitle("Teilen"));
  expect(screen.getByRole("checkbox", { name: /Andere/ })).toBeChecked();
  fireEvent.click(screen.getByRole("checkbox", { name: /Freund/ }));
  fireEvent.click(screen.getByRole("button", { name: "Abbrechen" }));
  fireEvent.click(screen.getByTitle("Speichern"));
  await waitFor(() => expect(editDiary).toHaveBeenCalledWith({
    id: "note",
    data: { text: "Erinnerung", players: ["me", "friend", "other"], category: "Erlebtes" },
  }));
});

test("retains the draft and reports an error when saving fails", async () => {
  useDispatch.mockReturnValue(() => ({ unwrap: () => Promise.reject("Speichern fehlgeschlagen") }));
  renderEdit();
  fireEvent.click(screen.getByTitle("Speichern"));
  expect(await screen.findByRole("alert")).toHaveTextContent("Speichern fehlgeschlagen");
  expect(screen.getByLabelText("Notiztext")).toHaveValue("Erinnerung");
  fireEvent.click(screen.getByTitle("Teilen"));
  expect(screen.getByRole("checkbox", { name: /Freund/ })).toBeChecked();
});
