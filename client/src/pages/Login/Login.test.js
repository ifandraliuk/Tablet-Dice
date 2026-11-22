import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./index";

const mockDispatch = jest.fn();
const mockNavigate = jest.fn();
let mockAuth;

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({ auth: mockAuth }),
}));
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../../features/auth/AuthSlice", () => ({
  login: (user) => ({ type: "login", payload: user }),
  reset: () => ({ type: "reset" }),
}));

beforeEach(() => {
  mockAuth = { user: null, registered: false, isError: false, isSuccess: false, message: "" };
  mockDispatch.mockClear();
  mockNavigate.mockClear();
});

test("submits the entered credentials through the form", () => {
  render(<Login />);
  fireEvent.change(screen.getByLabelText("Charaktername"), { target: { value: "Held" } });
  fireEvent.change(screen.getByLabelText("Passwort"), { target: { value: "geheim" } });
  fireEvent.submit(screen.getByRole("button", { name: "Einloggen" }).closest("form"));
  expect(mockDispatch.mock.calls).toEqual([
    [{ type: "reset" }],
    [{ type: "login", payload: { name: "Held", pwd: "geheim" } }],
  ]);
});

test("opens character creation without submitting the login form", () => {
  render(<Login />);
  fireEvent.click(screen.getByRole("button", { name: /Neuen Charakter erstellen/ }));
  expect(mockNavigate).toHaveBeenLastCalledWith("/create");
  expect(mockDispatch).not.toHaveBeenCalled();
});

test("shows login errors accessibly", () => {
  mockAuth.isError = true;
  mockAuth.message = "Anmeldung fehlgeschlagen";
  render(<Login />);
  expect(screen.getByRole("alert")).toHaveTextContent("Anmeldung fehlgeschlagen");
});

test.each([[false, "/player"], [true, "/register"]])(
  "keeps the redirect for a logged-in user (registered: %s)",
  (registered, path) => {
    mockAuth.user = { name: "Held" };
    mockAuth.registered = registered;
    render(<Login />);
    expect(mockNavigate).toHaveBeenCalledWith(path);
  }
);
