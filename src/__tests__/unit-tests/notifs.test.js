import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Notifications from "../../components/Header/notifications.jsx";
import { AuthContext } from "../../context/AuthProvider.jsx";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: "mockedUrlId", // replace 'mockedUrlId' with the actual value you want to use for testing
  }),
}));

jest.mock("../../supabase"); // Mock the supabase module

test("able to load notifications dropdown", async () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          auth: true, // Set auth to true
          user: {
            id: "610b241b-f4c2-40c1-bc6e-5d207d89c6d5",
            email: "first@test.com",
          }, // Mock user object
          updatePassword: jest.fn(), // Mock updatePassword function
        }}
      >
        <Notifications />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  await waitFor(
    () => {
      expect(screen.getByText("Notifications")).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
});

