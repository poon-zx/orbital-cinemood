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

test("able to search for movie", async () => {
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

    // input text into search bar
    const search_bar = screen.getByPlaceholderText("search movie name...");
    fireEvent.change(search_bar, { target: { value: "avengers" } });
    fireEvent.click(screen.getByRole("search-button"));

    // verify that cards are rendered
    await waitFor(() => {
        expect(screen.getByText("Search Results")).toBeInTheDocument();
        expect(screen.getAllByTestId("movie-card").length).toBeGreaterThan(0);
    }
    );
});
