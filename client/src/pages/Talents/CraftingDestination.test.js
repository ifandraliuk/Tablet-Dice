import React from "react";
import { render, screen } from "@testing-library/react";
import { useSelector } from "react-redux";
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import AllTalents from "./AllTalents";

jest.mock("react-redux", () => ({ useSelector: jest.fn() }));

test("highlights the requested crafting talent while retaining the other talents", () => {
  useSelector.mockImplementation((selector) => selector({ talents: {
    allTalents: [
      { _id: "cook", name: "Kochen", category: "Handwerk", dice: "VIT/GSK/AUS" },
      { _id: "smith", name: "Schmieden", category: "Handwerk", dice: "STR/GSK/AUS" },
    ],
    playerTalents: [],
  } }));
  render(<AllTalents filter="Handwerk" targetTalent="Kochen" icons={{ Handwerk: faHammer }} bonusMap={new Map()} probeData={{ attributes: {}, boni: [] }} />);
  const target = screen.getByText("Kochen").closest("tr");
  expect(target).toHaveAttribute("id", "talent-progression-target");
  expect(target).toHaveClass("talent-progression-target");
  expect(screen.getByText("Schmieden")).toBeInTheDocument();
});
