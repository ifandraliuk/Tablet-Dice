import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import StationImage from "./StationImage";

test("shows configured art and reports a load failure without hiding station information", () => {
  const station = { name: "Schmiede", values: ["Schmiede"], image: "/images/crafting/schmiede.webp" };
  const { container } = render(<StationImage station={station} index={0} points={1} context="detail" />);
  const image = container.querySelector("img");
  expect(image).toHaveAttribute("src", station.image);
  expect(image).toHaveAttribute("alt", "");
  expect(container.querySelector(".crafting-station-image__visual")).not.toHaveTextContent("Schmiede");
  expect(container.querySelector(".crafting-station-image__content")).toHaveTextContent("Schmiede");
  fireEvent.error(image);
  expect(screen.getByText("Bild konnte nicht geladen werden")).toBeInTheDocument();
  expect(screen.getByText("Schmiede")).toBeInTheDocument();
  expect(screen.getByText("Freigeschaltet")).toBeInTheDocument();
});

test("marks an undefined station as planned rather than unlocked", () => {
  render(<StationImage station={{ name: "Stufe 1", values: [], image: null }} index={0} points={1} context="detail" />);
  expect(screen.getByText("Herstellungsort folgt")).toBeInTheDocument();
  expect(screen.queryByText("Freigeschaltet")).not.toBeInTheDocument();
});

test("keeps station details off profession card images", () => {
  const { container } = render(<StationImage station={{ name: "Schmiede", values: ["Schmiede"], image: null }} index={0} points={1} context="card" />);
  expect(container.querySelector(".crafting-station-image__content")).not.toBeInTheDocument();
  expect(screen.getByText("Bild folgt")).toBeInTheDocument();
});
