import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieList from "../../components/MovieList/movieList";
import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

describe("MovieList component", () => {
  test("renders without error", () => {
    render(
      <MemoryRouter>
        <MovieList />
      </MemoryRouter>
    );

    // Assert that the component renders without throwing an error
    expect(screen.getByTestId("movie-list")).toBeInTheDocument();
  });

  test("displays movie cards when data is fetched", async () => {
    render(
      <MemoryRouter>
        <MovieList />
      </MemoryRouter>
    );

    // Wait for the movie cards to be rendered
    await waitFor(() => {
      expect(screen.getAllByTestId("movie-card")).toHaveLength(20);
    });
  });

  test("displays pagination component when there are multiple pages", async () => {
    render(
      <MemoryRouter>
        <MovieList />
      </MemoryRouter>
    );

    // Wait for the pagination component to be rendered
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });
  });

  test("can go to next page", async () => {
    render(
      <MemoryRouter>
        <MovieList />
      </MemoryRouter>
    );

    // Wait for the pagination component to be rendered
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    // Assert that the next button changes the page
    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);
    expect(screen.getByText("Page 2")).toBeInTheDocument();
  });

  test("can go to previous page", async () => {
    render(
      <MemoryRouter>
        <MovieList />
      </MemoryRouter>
    );

    // Wait for the pagination component to be rendered
    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    // Assert that the next button changes the page
    const nextButton = screen.getByTestId("next-button");
    fireEvent.click(nextButton);
    expect(screen.getByText("Page 2")).toBeInTheDocument();

    // Assert that the previous button changes the page
    const previousButton = screen.getByTestId("previous-button");
    fireEvent.click(previousButton);
    expect(screen.getByText("Page 1")).toBeInTheDocument();
  });
});
