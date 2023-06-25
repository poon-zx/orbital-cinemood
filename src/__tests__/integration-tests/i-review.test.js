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

  test("able to add review to movie", async () => {
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

    // click on the review button
    await waitFor(() => {
        const review_button = screen.getByText("Write a Review");
        fireEvent.click(review_button);
    }, { timeout: 5000 });

    // fill up fields
    const reviewTitle = screen.getByPlaceholderText("Write a headline for your review");
    const reviewBody = screen.getByPlaceholderText("Write your review here");

    fireEvent.change(reviewTitle, { target: { value: "Test Review Title" } });
    fireEvent.change(reviewBody, { target: { value: "Test Review Body" } });

    // click on the submit button
    fireEvent.click(screen.getByText('Save Changes'));
  });