import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import authReducer, { login, logout } from "./features/auth/AuthSlice";
import playerReducer from "./features/player/playerSlice";
import playerService from "./features/player/playerService";

jest.mock("./features/auth/authService", () => ({}));
jest.mock("./features/player/playerService", () => ({ getFraction: jest.fn() }));
jest.mock("./components/Nav", () => () => <div>Navigation</div>);
jest.mock("./pages/Login", () => () => <div>Login</div>);
jest.mock("./pages/Login/index", () => () => <div>Login</div>);
jest.mock("./pages/ErrorPage", () => () => null);
jest.mock("./pages/Create/index", () => () => null);
jest.mock("./pages/Talents/index", () => () => null);
jest.mock("./pages/Bestiarium/index", () => () => null);
jest.mock("./pages/Enemies", () => () => null);
jest.mock("./pages/Inventory/index", () => () => null);
jest.mock("./pages/Diary/index", () => () => null);
jest.mock("./pages/Companions/index", () => () => null);
jest.mock("./pages/Dashboard/index", () => () => <div>Dashboard</div>);
jest.mock("./pages/Atlas", () => () => null);

function renderApp() {
  const store = configureStore({ reducer: { auth: authReducer, player: playerReducer } });
  const rendered = render(<Provider store={store}><MemoryRouter initialEntries={["/player"]}><App /></MemoryRouter></Provider>);
  return { store, ...rendered };
}

beforeEach(() => {
  localStorage.clear();
  playerService.getFraction.mockReset();
});

test("loads the origin background immediately after login and refreshes it for another character", async () => {
  playerService.getFraction.mockResolvedValueOnce("Welles").mockResolvedValueOnce("Algor");
  const { store, container } = renderApp();
  act(() => { store.dispatch(login.fulfilled({ _id: "first", token: "first-token" }, "1")); });
  await waitFor(() => expect(container.querySelector(".Welles-bg")).toBeInTheDocument());
  expect(playerService.getFraction).toHaveBeenCalledWith("first-token");
  expect(screen.getByText("Navigation")).toBeInTheDocument();

  act(() => { store.dispatch(logout.fulfilled(undefined, "2")); });
  await waitFor(() => expect(container.querySelector(".Welles-bg")).not.toBeInTheDocument());
  act(() => { store.dispatch(login.fulfilled({ _id: "second", token: "second-token" }, "3")); });
  await waitFor(() => expect(container.querySelector(".Algor-bg")).toBeInTheDocument());
  expect(playerService.getFraction).toHaveBeenCalledWith("second-token");
});

test("reports a background load error and retries on request", async () => {
  playerService.getFraction.mockRejectedValueOnce(new Error("Netzwerkfehler")).mockResolvedValueOnce("Thamor");
  const { store, container } = renderApp();
  act(() => { store.dispatch(login.fulfilled({ _id: "hero", token: "token" }, "1")); });
  expect(await screen.findByRole("alert")).toHaveTextContent("Netzwerkfehler");
  fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));
  await waitFor(() => expect(container.querySelector(".Thamor-bg")).toBeInTheDocument());
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("does not apply an old character's response after switching accounts", async () => {
  let resolveFirst;
  playerService.getFraction.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve; })).mockResolvedValueOnce("Algor");
  const { store, container } = renderApp();
  act(() => { store.dispatch(login.fulfilled({ _id: "first", token: "first-token" }, "1")); });
  await waitFor(() => expect(resolveFirst).toBeDefined());
  act(() => { store.dispatch(login.fulfilled({ _id: "second", token: "second-token" }, "2")); });
  await waitFor(() => expect(container.querySelector(".Algor-bg")).toBeInTheDocument());
  await act(async () => { resolveFirst("Welles"); });
  expect(container.querySelector(".Welles-bg")).not.toBeInTheDocument();
  expect(localStorage.getItem("fraction")).toBe("Algor");
});
