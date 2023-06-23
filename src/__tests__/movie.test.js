import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import Movie from "../components/Movie/movie";
import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

jest.mock("../modals/rating.js", () => () => <div>Mock Rating</div>);
jest.mock("../modals/writeReview.js", () => () => <div>Mock WriteReview</div>);
jest.mock("../modals/watch.js", () => () => <div>Mock Watch</div>);
jest.mock("../components/Forum/forum.js", () => () => <div>Mock Forum</div>);

describe("Movie Component", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it("renders mock movie data", async () => {
    const movie = {
      original_title: "Test Movie",
      tagline: "Test Tagline",
      vote_average: 8.5,
      vote_count: 2000,
      runtime: 120,
      release_date: "2023-01-01",
      genres: [{ id: 1, name: "Test Genre" }],
      overview: "Test overview",
      homepage: "https://testmovie.com",
      backdrop_path: "/test.jpg",
      poster_path: "/test.jpg",
    };

    const reviews = {
      id: 1,
      results: [{ id: "review1", content: "Great movie!", author: "John Doe" }],
    };

    fetch.mockResponses(
      [JSON.stringify(movie), { status: 200 }],
      [JSON.stringify(reviews), { status: 200 }]
    );

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Movie />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      expect(screen.getByText("Test Tagline")).toBeInTheDocument();
      expect(screen.getByText("8.5")).toBeInTheDocument();
      expect(screen.getByText("(2000) votes")).toBeInTheDocument();
      expect(screen.getByText("120 mins")).toBeInTheDocument();
      expect(screen.getByText("Release date: 2023-01-01")).toBeInTheDocument();
      expect(screen.getByText("Test Genre")).toBeInTheDocument();
      expect(screen.getByText("Test overview")).toBeInTheDocument();
    });
  });

  it("movie link redirects to external movie page", async () => {
    const movie = {
      original_title: "Test Movie",
      tagline: "Test Tagline",
      vote_average: 8.5,
      vote_count: 2000,
      runtime: 120,
      release_date: "2023-01-01",
      genres: [{ id: 1, name: "Test Genre" }],
      overview: "Test overview",
      homepage: "https://testmovie.com",
      backdrop_path: "/test.jpg",
      poster_path: "/test.jpg",
    };

    const reviews = {
      id: 1,
      results: [{ id: "review1", content: "Great movie!", author: "John Doe" }],
    };

    fetch.mockResponses(
      [JSON.stringify(movie), { status: 200 }],
      [JSON.stringify(reviews), { status: 200 }]
    );

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Movie />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("movie-homepage")).toBeInTheDocument();
    });

    const movieLink = screen.getByTestId("movie-homepage");
    expect(movieLink).toHaveAttribute("href", "https://testmovie.com");
  });

  it("renders reviews and add to watch sections", async () => {
    const movie = {
      original_title: "Test Movie",
      tagline: "Test Tagline",
      vote_average: 8.5,
      vote_count: 2000,
      runtime: 120,
      release_date: "2023-01-01",
      genres: [{ id: 1, name: "Test Genre" }],
      overview: "Test overview",
      homepage: "https://testmovie.com",
      backdrop_path: "/test.jpg",
      poster_path: "/test.jpg",
    };

    const reviews = {
      id: 1,
      results: [{ id: "review1", content: "Great movie!", author: "John Doe" }],
    };

    fetch.mockResponses(
      [JSON.stringify(movie), { status: 200 }],
      [JSON.stringify(reviews), { status: 200 }]
    );

    render(
      <MemoryRouter initialEntries={["/movie/1"]}>
        <Movie />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Reviews")).toBeInTheDocument();
      expect(screen.getByText("Mock Watch")).toBeInTheDocument();
    });
  });
});

