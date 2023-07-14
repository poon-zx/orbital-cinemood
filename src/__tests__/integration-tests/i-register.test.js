import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import App from "../../App";

function RouterWrapper({ children }) {
  const location = useLocation();
  return (
    <div>
      <div data-testid="location-display">{location.pathname}</div>
      {children}
    </div>
  );
}

describe("User Registration Flow", () => {
  it("should register a new user", async () => {
    // Mock the necessary functions and objects
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      useNavigate: () => mockNavigate,
    }));
    jest.mock("../../supabase.js", () => ({
      supabase: {
        auth: {
          onAuthStateChange: jest.fn(),
          signUp: jest.fn().mockResolvedValue({ user: { id: 1 } }),
        },
      },
    }));

    // Render the Login component
    const { getByLabelText, getByRole } = render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthContext.Provider
          value={{
            auth: true, // Set auth to true
            user: { id: 11111, email: "first@test.com" }, // Mock user object
            updatePassword: jest.fn(), // Mock updatePassword function
          }}
        >
          <RouterWrapper>
            <App />
          </RouterWrapper>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Fill in the registration form fields
    // Click on a with href="#auth-sign-up"
    const registerLink = screen.getByText("Don't have an account? Sign up");
    fireEvent.click(registerLink);
    const emailInput = getByLabelText("Email address");
    const passwordInput = getByLabelText("Create a Password");
    const registerButton = screen.getByText("Sign up");

    fireEvent.change(emailInput, { target: { value: "test@exampleeeeeeee.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click the register button
    fireEvent.click(registerButton);

    // Wait for the registration process to complete
    await waitFor(() => {
      expect(screen.getByText("Movie Recommender")).toBeInTheDocument();
    }, { timeout: 10000});
  });
});
