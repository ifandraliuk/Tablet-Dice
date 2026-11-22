import React from "react";
import { render, screen } from "@testing-library/react";
import NoteDate from "./NoteDate";

const createdAt = "2025-03-15T12:30:00.000Z";
const updatedAt = "2025-03-16T14:45:00.000Z";

test("labels creation and later modification timestamps", () => {
  const { container } = render(<NoteDate createdAt={createdAt} updatedAt={updatedAt} />);
  const times = container.querySelectorAll("time");
  expect(times).toHaveLength(2);
  expect(times[0]).toHaveAttribute("datetime", createdAt);
  expect(times[0].parentElement).toHaveTextContent("Erstellt:");
  expect(times[1]).toHaveAttribute("datetime", updatedAt);
  expect(times[1].parentElement).toHaveTextContent("Zuletzt geändert:");
});

test.each([undefined, null, "ungültig", createdAt, "2025-03-14T12:30:00.000Z"])(
  "does not show a modification for non-later date %s",
  (value) => {
    const { container } = render(<NoteDate createdAt={createdAt} updatedAt={value} />);
    expect(container.querySelectorAll("time")).toHaveLength(1);
    expect(screen.queryByText(/Zuletzt geändert:/)).not.toBeInTheDocument();
  }
);

test("does not infer a modification when the creation date is missing", () => {
  render(<NoteDate updatedAt={updatedAt} />);
  expect(screen.getByText("Ohne Datum")).toBeInTheDocument();
  expect(screen.queryByText(/Zuletzt geändert:/)).not.toBeInTheDocument();
});
