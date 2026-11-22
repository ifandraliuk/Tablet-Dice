import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import Note from "./Note";

const note = {
  _id: "note",
  createdAt: "2025-03-15T12:30:00.000Z",
  players: [{ _id: "me", name: "Ich" }, { _id: "friend", name: "Freund" }],
  text: "<h4>Erinnerung</h4><p>Der <strong>Drache</strong> ist zurück.</p>",
};

test("shows the date before the complete formatted text and exposes the actions", async () => {
  const onEdit = jest.fn();
  const onRemove = jest.fn();
  render(<Note note={note} user={{ _id: "me" }} fractionTheme="Welles" editId="" onEdit={onEdit} onRemove={onRemove} />);

  const card = screen.getByRole("article");
  const time = card.querySelector("time");
  expect(time).toHaveAttribute("datetime", note.createdAt);
  expect(time.compareDocumentPosition(screen.getByRole("heading", { name: "Erinnerung" })) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(within(card).getByText("Drache").tagName).toBe("STRONG");
  expect(card).toHaveTextContent("ist zurück.");
  fireEvent.click(within(card).getByRole("button", { name: "Eintrag bearbeiten" }));
  fireEvent.click(within(card).getByRole("button", { name: "Eintrag löschen" }));
  expect(onEdit).toHaveBeenCalledTimes(1);
  expect(onRemove).toHaveBeenCalledTimes(1);
  fireEvent.click(within(card).getByRole("button", { name: "Freigabe anzeigen: 1 Mitspieler" }));
  expect(await screen.findByText("Freund")).toBeInTheDocument();
  expect(screen.queryByText("Ich")).not.toBeInTheDocument();
});

test("identifies entries visible only to the current user", async () => {
  render(<Note note={{ ...note, players: [{ _id: "me", name: "Ich" }] }} user={{ _id: "me" }} editId="" />);
  fireEvent.click(screen.getByRole("button", { name: "Freigabe anzeigen: Nur du" }));
  expect(await screen.findByText("Sichtbarkeit")).toBeInTheDocument();
  expect(screen.getAllByText("Nur du")).toHaveLength(2);
});

test("handles missing or invalid dates and prevents editing a second entry", () => {
  render(
    <Note
      note={{ ...note, createdAt: "ungültig" }}
      fractionTheme="Welles"
      editId="another"
      onEdit={jest.fn()}
      onRemove={jest.fn()}
    />
  );
  expect(screen.getByText("Ohne Datum")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Eintrag bearbeiten" })).toBeDisabled();
});
