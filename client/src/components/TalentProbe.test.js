import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TalentProbe, TalentProbeRules } from "./TalentProbe";

test("shows current target values and the combined pool for a learned talent", () => {
  render(<TalentProbe dice="VIT/GSK/AUS" attributes={{ vitality: 10, dexterity: 15, stamina: 10 }} points={3} bonus={1} />);
  expect(screen.getByText("VIT 10")).toBeInTheDocument();
  expect(screen.getByText("GSK 15")).toBeInTheDocument();
  expect(screen.getByText("AUS 10")).toBeInTheDocument();
  expect(screen.getByText("Ausgleich: 3 Talentpunkte + 1 Ausrüstungsbonus = 4")).toBeInTheDocument();
  expect(screen.queryByText(/Ungelernt/)).not.toBeInTheDocument();
});

test("applies the unlearned penalty to each occurrence and keeps bonuses separate", () => {
  render(<TalentProbe dice="INT/INT/DEX" attributes={{ intelligent: 12, dexterity: 10 }} points={0} bonus={2} />);
  expect(screen.getAllByText("INT 11")).toHaveLength(2);
  expect(screen.getByText("DEX 9")).toBeInTheDocument();
  expect(screen.getByText("Ungelernt: −1 je Attribut")).toBeInTheDocument();
  expect(screen.getByText("Ausgleich: 0 Talentpunkte + 2 Ausrüstungsbonus = 2")).toBeInTheDocument();
});

test("does not invent values for unknown attributes", () => {
  render(<TalentProbe dice="VIT/GSK/XYZ" attributes={{ vitality: 10, dexterity: 15 }} points={1} bonus={0} />);
  expect(screen.getByText("Attributwerte nicht verfügbar")).toBeInTheDocument();
});

test("explains the inclusive threshold and shared pool", async () => {
  render(<TalentProbeRules fractionTheme="Welles" />);
  fireEvent.click(screen.getByRole("button", { name: "Informationen zur Talentprobe" }));
  expect(screen.getByRole("dialog", { name: "Die Talentprobe" })).toBeInTheDocument();
  expect(screen.getByText(/höchstens dem angezeigten Attributwert/)).toBeInTheDocument();
  expect(screen.getByText(/gemeinsamer Vorrat aus Talentpunkten und Ausrüstungsboni/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
});

test("keeps the talent table compact while retaining the unlearned penalty", () => {
  render(<TalentProbe dice="VIT/GSK/AUS" attributes={{ vitality: 10, dexterity: 15, stamina: 10 }} points={0} bonus={2} compact />);
  expect(screen.getByText("9 / 14 / 9")).toBeInTheDocument();
  expect(screen.getByText("Ungelernt: −1 je Attribut")).toBeInTheDocument();
  expect(screen.queryByText(/Ausgleich:/)).not.toBeInTheDocument();
});

test("can show the shared pool with compact values", () => {
  render(<TalentProbe dice="VIT/GSK/AUS" attributes={{ vitality: 10, dexterity: 15, stamina: 10 }} points={2} bonus={-1} compact showBonus />);
  expect(screen.getByText("10 / 15 / 10")).toBeInTheDocument();
  expect(screen.getByText("Ausgleich: 2 Talentpunkte − 1 Ausrüstungsbonus = 1")).toBeInTheDocument();
});
