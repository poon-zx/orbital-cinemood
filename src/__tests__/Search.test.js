import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../pages/Search';

jest.mock('../components/Card/card.js', () => {
  return function DummyCards({ movie }) {
    return (
      <div>{movie.original_title}</div>
    );
  };
});

test("renders Search component", () => {
  render(<Search />);
  expect(screen.getByText(/Search/i)).toBeInTheDocument();
});

test("submits form and calls search function", async () => {
  const movie = {
    id: 1,
    original_title: "Movie Test",
    release_date: "2022",
    vote_average: "7.5",
    overview: "Movie Test Overview",
    poster_path: "/test.jpg"
  };

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ results: [movie] }),
    })
  );

  render(<Search />);

  const searchInput = screen.getByPlaceholderText(/search movie name.../i);
  const searchButton = screen.getByRole('button');

  fireEvent.change(searchInput, { target: { value: 'Movie Test' } });
  fireEvent.click(searchButton);

  await waitFor(() => expect(screen.getByText("Movie Test")).toBeInTheDocument());
});
