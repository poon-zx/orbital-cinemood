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

  test("able to navigate to CineStats page", async () => {
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

    const statsButton = screen.getByTestId("cine-stats-btn");
    fireEvent.click(statsButton);

    await waitFor(() => {
        expect(screen.getByText("Ratings")).toBeInTheDocument();
        expect(screen.getByText("Genres")).toBeInTheDocument();
    }, { timeout: 10000 });
    });