import React from "react";
import { render, screen } from "@testing-library/react";
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import ActiveTalentRow from "./ActiveTalentsRow";
import AllTalentRow from "./AllTalentRow";

const talent = { _id: "smith", name: "Schmieden", category: "Handwerk", dice: "STR/GSK/AUS" };
const probeData = { attributes: { strength: 10, dexterity: 15, stamina: 10 }, boni: [] };
const icons = { Handwerk: faHammer };

test("shows current values beside a learned talent", () => {
  render(<table><tbody><ActiveTalentRow el={{ _id: "row", talent, points: 3 }} bonus={1} icons={icons} probeData={probeData} /></tbody></table>);
  expect(screen.getByText("10 / 15 / 10")).toBeInTheDocument();
  expect(screen.getByText("+(1)")).toBeInTheDocument();
});

test("shows reduced values and the bonus for an unlearned talent", () => {
  render(<table><tbody><AllTalentRow talent={talent} existsPoints={null} bonus={1} icons={icons} probeData={probeData} /></tbody></table>);
  expect(screen.getByText("9 / 14 / 9")).toBeInTheDocument();
  expect(screen.getByText("Ungelernt: −1 je Attribut")).toBeInTheDocument();
  expect(screen.getByText("+(1)")).toBeInTheDocument();
});
