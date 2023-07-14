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

test("able to navigate to Search Users page, find a user and click on Movie Blend", async () => {
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

  const friendsButton = screen.getByText("Friends");
  fireEvent.click(friendsButton);

  const searchUsersButton = screen.getByTestId("search-users-btn");
  fireEvent.click(searchUsersButton);

  const searchUsersInput = screen.getByTestId("search-input");
  fireEvent.change(searchUsersInput, { target: { value: "kay" } });

  const searchButton = screen.getByTestId("search-btn");
  fireEvent.click(searchButton);

  await waitFor(
    () => {
      const searchCard = screen.getByTestId("search-card");
      fireEvent.click(searchCard);
    },
    { timeout: 5000 }
  );

  await waitFor(
    () => {
      expect(screen.getByText("kay")).toBeInTheDocument();
    },
    { timeout: 5000 }
  );

  const movieBlendButton = screen.getByTestId("blend-btn");
  fireEvent.click(movieBlendButton);

  await waitFor(
    () => {
      expect(screen.getByText("Movie Blend with kay")).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
});
