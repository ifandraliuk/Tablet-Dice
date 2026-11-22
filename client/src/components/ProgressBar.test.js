import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressBar from "./ProgressBar";

test.each(["neutral", "aggressiv", "flieht", "Krieger", "Fernkampf", "Arbeiter", "Schurke"])(
  "retains the %s status color",
  (status) => {
    render(
      <ProgressBar
        color={status}
        name="Lebenspunkte"
        ariaLabel="Lebenspunkte von Falke"
        current={30}
        max={60}
      />
    );

    const bar = screen.getByRole("progressbar", { name: "Lebenspunkte von Falke" });
    expect(bar).toHaveAttribute("aria-valuenow", "30");
    expect(bar).toHaveAttribute("aria-valuemax", "60");
    expect(bar).toHaveAttribute("aria-valuetext", "30 von 60");
    expect(bar).toHaveTextContent("Lebenspunkte: 30 / 60");
    expect(bar.firstChild).toHaveClass(status);
    expect(bar.firstChild).toHaveStyle({ width: "50%" });
  }
);

test("keeps the label visible at zero and updates the fill", () => {
  const { rerender } = render(
    <ProgressBar color="neutral" name="Lebenspunkte" current={0} max={60} />
  );
  const bar = screen.getByRole("progressbar", { name: "Lebenspunkte" });
  expect(bar).toHaveTextContent("Lebenspunkte: 0 / 60");
  expect(bar.firstChild).toHaveStyle({ width: "0%" });

  rerender(<ProgressBar color="neutral" name="Lebenspunkte" current={60} max={60} />);
  expect(bar).toHaveTextContent("Lebenspunkte: 60 / 60");
  expect(bar.firstChild).toHaveStyle({ width: "100%" });
});

test("bounds the fill and accessible value to the maximum", () => {
  render(<ProgressBar color="neutral" name="Lebenspunkte" current={80} max={60} />);
  const bar = screen.getByRole("progressbar", { name: "Lebenspunkte" });
  expect(bar).toHaveAttribute("aria-valuenow", "60");
  expect(bar).toHaveAttribute("aria-valuetext", "80 von 60");
  expect(bar.firstChild).toHaveStyle({ width: "100%" });
});
