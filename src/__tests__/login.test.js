import React from "react";
import { render, waitFor, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { useAuth} from "../context/AuthProvider";
import Login from "../pages/Login";
import "@testing-library/jest-dom";
import { createMemoryHistory } from "history";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));


// Mock implementation of useAuth
jest.mock("../context/AuthProvider", () => ({
  useAuth: jest.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => ({
      auth: true,
      user: null,
      updatePassword: jest.fn(),
    }));
  });

  test("should display login form initially", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Your email address");
    expect(emailInput).toBeInTheDocument();

    const passwordInput = screen.getByPlaceholderText("Your password");
    expect(passwordInput).toBeInTheDocument();
  });

  test("should display error message if login credentials are invalid", async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText("Your email address");
    fireEvent.change(emailInput, { target: { value: "test" } });

    const passwordInput = screen.getByPlaceholderText("Your password");
    fireEvent.change(passwordInput, { target: { value: "test" } });

    const signInButton = screen.getByText("Sign in");
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid login credentials")).toBeInTheDocument();
    });
  });

  test("clicking register button redirects to register page", () => {
    const history = createMemoryHistory();

    global.window = { location: { pathname: null } };

    render(
      <BrowserRouter history={history}>
        <Login />
      </BrowserRouter>
    );

    const registerButton = screen.getByText("Don't have an account? Sign up");
    fireEvent.click(registerButton);

    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });

  test("clicking forgot password button redirects to forgot password page", () => {
    const history = createMemoryHistory();

    global.window = { location: { pathname: null } };

    render(
      <BrowserRouter history={history}>
        <Login />
      </BrowserRouter>
    );

    const forgotPasswordButton = screen.getByText("Forgot your password?");
    fireEvent.click(forgotPasswordButton);

    expect(
      screen.getByText("Send reset password instructions")
    ).toBeInTheDocument();
  });
});
