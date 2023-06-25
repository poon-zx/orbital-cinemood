import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import Login from "../../pages/Login";
import "@testing-library/jest-dom";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import { supabase } from "../../supabase";
import App from "../../App";
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
    const { getByLabelText, getByRole } = render(
      <Router>
        <Login /> 
        <Routes>
            <Route path="/home" element={<PersonalizedSearch />} />
        </Routes>
      </Router>
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
    });
  });
});
