import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import DiarySidebar from "./DiarySidebar";

test("exposes category names, counts and the selected state when changing categories", () => {
  const setCategory = jest.fn();
  render(
    <DiarySidebar
      diary={[{ category: "Personen" }, { category: "Personen" }, { category: "Orte" }]}
      activeCategory="Personen"
      setCategory={setCategory}
      fractionTheme="Welles"
    />
  );
  expect(screen.getByRole("button", { name: "Personen (2)" })).toHaveAttribute("aria-pressed", "true");
  const places = screen.getByRole("button", { name: "Orte (1)" });
  expect(places).toHaveAttribute("aria-pressed", "false");
  fireEvent.click(places);
  expect(setCategory).toHaveBeenCalledWith("Orte");
});
