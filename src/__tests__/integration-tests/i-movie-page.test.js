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

  test("able to click add movie to watchlist", async () => {
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

    const popularButton = screen.getAllByText("Popular")[0];
    fireEvent.click(popularButton);

    await waitFor(() => {
        // click on the first movie card link
        const movie_card = screen.getAllByTestId("movie-card-done")[0];
        fireEvent.click(movie_card);
    }, { timeout: 5000 });

    // click on the add to watchlist button
    await waitFor(() => {
        const watchlist_button = screen.getByText("Add this movie");
        fireEvent.click(watchlist_button);
    }, { timeout: 5000 });

    // click on the watchlist link
    fireEvent.click(screen.getByText('Add to watchlist'));
  });

  