import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import StationImage from "./StationImage";

afterEach(() => jest.restoreAllMocks());

test("shows configured art and reports a load failure without hiding station information", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ status: 500 });
  const station = { name: "Schmiede", values: ["Schmiede"], image: "/images/crafting/schmiede.webp" };
  const { container } = render(<StationImage station={station} index={0} points={1} context="detail" />);
  const image = container.querySelector("img");
  expect(image).toHaveAttribute("src", station.image);
  expect(image).toHaveAttribute("alt", "");
  expect(container.querySelector(".crafting-station-image__visual")).not.toHaveTextContent("Schmiede");
  expect(container.querySelector(".crafting-station-image__content")).toHaveTextContent("Schmiede");
  fireEvent.error(image);
  expect(await screen.findByText("Bild konnte nicht geladen werden")).toBeInTheDocument();
  expect(screen.getByText("Schmiede")).toBeInTheDocument();
  expect(screen.getByText("Freigeschaltet")).toBeInTheDocument();
});

test("shows the placeholder for a missing image", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ status: 404 });
  const { container } = render(<StationImage station={{ name: "Alchemiehütte", values: ["Alchemiehütte"], image: "/crafting/images/alchemy-1.png" }} index={0} points={1} context="detail" />);
  fireEvent.error(container.querySelector("img"));
  expect(await screen.findByText("Bild folgt")).toBeInTheDocument();
  expect(screen.getByText("Alchemiehütte")).toBeInTheDocument();
});

test("reports a network failure instead of treating it as a missing image", async () => {
  jest.spyOn(global, "fetch").mockRejectedValue(new Error("network error"));
  const { container } = render(<StationImage station={{ name: "Schmiede", values: ["Schmiede"], image: "/crafting/images/smithing-1.png" }} index={0} points={1} context="detail" />);
  fireEvent.error(container.querySelector("img"));
  expect(await screen.findByText("Bild konnte nicht geladen werden")).toBeInTheDocument();
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
