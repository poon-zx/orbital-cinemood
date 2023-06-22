import React from "react";
import { render,  screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Search from "../pages/Search";
import { SearchContext } from '../context/SearchContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock("../components/Card/card.js", () => {
  return function DummyCards({ movie }) {
    return <div>{movie.original_title}</div>;
  };
});


const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={["/search"]}>
    <SearchContext.Provider value={{ searchText: 'Movie Test', setSearchText: jest.fn() }}>
      <Routes>
        <Route path="/search" element={ children } />
      </Routes>
    </SearchContext.Provider>
  </MemoryRouter>
);

test("renders Search component", () => {
  render(<Search />, { wrapper });
  expect(screen.getAllByText("Search Results")[0]).toBeInTheDocument();
});

test("displays search results", async () => {
  const movie = {
    id: 1,
    original_title: "Movie Test",
    release_date: "2022",
    vote_average: "7.5",
    overview: "Movie Test Overview",
    poster_path: "/test.jpg",
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ results: [movie], total_results: 1 }),
    })
  );

  render(<Search />, { wrapper });

  await waitFor(() =>
    expect(screen.getByText("Movie Test")).toBeInTheDocument()
  );
});
