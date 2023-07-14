import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import Login from "../../pages/Login";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../../App";
import PersonalizedSearch from "../../pages/PersonalizedSearch";
import { AuthContext } from "../../context/AuthProvider.jsx";


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

    // Fill in the login form fields

    const emailInput = getByLabelText("Email address");
    const passwordInput = getByLabelText("Your Password");
    const loginButton = screen.getByText("Sign in");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click the login button
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Movie Recommender")).toBeInTheDocument();
    }, { timeout: 10000});
  });
});
