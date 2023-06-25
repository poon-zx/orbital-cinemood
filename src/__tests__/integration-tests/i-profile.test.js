import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  useLocation,
  MemoryRouter,
} from "react-router-dom";
import App from "../../App.js";
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

  test("able to navigate to profile", async () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
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

    const profileButton = screen.getByText("Profile");
    fireEvent.click(profileButton);

    await waitFor(() => {
        expect(screen.getByText("Watchlist")).toBeInTheDocument();
        expect(screen.getByText("Watch history")).toBeInTheDocument();
    });
    });