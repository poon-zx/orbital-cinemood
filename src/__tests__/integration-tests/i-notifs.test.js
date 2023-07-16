import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useLocation, MemoryRouter } from "react-router-dom";
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

test("able to load notifications dropdown", async () => {
  render(
    <MemoryRouter initialEntries={["/home"]}>
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
        <RouterWrapper>
          <App />
        </RouterWrapper>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  const notifButton = screen.getByTestId("notifs-btn");
  fireEvent.click(notifButton);

  await waitFor(
    () => {
      expect(screen.getByText("No notifications")).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
});
