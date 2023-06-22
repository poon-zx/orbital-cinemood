import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Cards from "../components/Card/card";
import "@testing-library/jest-dom";

describe("Cards component", () => {
  test("hovering on a card displays the info", async () => {
    render(
      <BrowserRouter>
        <Cards
          movie={{
            id: 1,
            poster_path: "/example-poster.jpg",
            original_title: "Example Movie",
            release_date: "2023-01-01",
            vote_average: 7.5,
            overview: "Lorem ipsum dolor sit amet",
          }}
        />
      </BrowserRouter>
    );

    const card = screen.getByTestId("movie-card");

    fireEvent.mouseEnter(card);

    await waitFor(() => {
      const titleElement = screen.getByText("Example Movie");
      const runtimeElement = screen.getByText("2023-01-01");
      const ratingElement = screen.getByText("7.5");
      const descriptionElement = screen.getByText("Lorem ipsum dolor sit amet...");

      expect(titleElement).toBeInTheDocument();
      expect(runtimeElement).toBeInTheDocument();
      expect(ratingElement).toBeInTheDocument();
      expect(descriptionElement).toBeInTheDocument();
    }, { timeout: 3000 }); // Adjust the timeout if needed
  });

  test("clicking on a card changes the link", async () => {
    render(
      <BrowserRouter>
        <Cards
          movie={{
            id: 1,
            poster_path: "/example-poster.jpg",
            original_title: "Example Movie",
            release_date: "2023-01-01",
            vote_average: 7.5,
            overview: "Lorem ipsum dolor sit amet",
          }}
        />
      </BrowserRouter>
    );

    const card = screen.getByTestId("movie-card");

    fireEvent.mouseEnter(card);

    await waitFor(() => {
      const cardLink = screen.getByText("Example Movie");
      fireEvent.click(cardLink);
      expect(window.location.pathname).toBe("/movie/1");
    
    }, { timeout: 3000 }); // Adjust the timeout if needed
  });
});
