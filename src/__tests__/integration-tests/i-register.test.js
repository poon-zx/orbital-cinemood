import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import Login from "../../pages/Login";
import "@testing-library/jest-dom"
import { MemoryRouter as Router } from "react-router-dom";
import PersonalizedSearch from "../../pages/PersonalizedSearch";

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
    const { getByLabelText, getByRole } = render(<Router><Login /> <PersonalizedSearch /> </Router>);

    // Fill in the registration form fields
    // Click on a with href="#auth-sign-up"
    const registerLink = screen.getByText("Don't have an account? Sign up")
    fireEvent.click(registerLink);
    const emailInput = getByLabelText("Email address");
    const passwordInput = getByLabelText("Create a Password");
    const registerButton = screen.getByText("Sign up");

    fireEvent.change(emailInput, { target: { value: "test@exampleeeee.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Click the register button
    fireEvent.click(registerButton);

    // Wait for the registration process to complete
    expect(screen.getByText("Movie Recommender")).toBeInTheDocument();

  });
});
