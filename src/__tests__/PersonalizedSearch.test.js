import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PersonalizedSearch from "../pages/PersonalizedSearch";

// Mock the global fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ results: [] }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test("renders PersonalizedSearch component", () => {
  render(<PersonalizedSearch />);
  expect(screen.getByText(/Movie Recommender/i)).toBeInTheDocument();
});

test("submits form and calls search function", async () => {
  render(<PersonalizedSearch />);
  const searchInput = screen.getByPlaceholderText(/I want to watch a .../i);
  const searchButton = screen.getByRole("button");

  fireEvent.change(searchInput, { target: { value: "action" } });
  fireEvent.click(searchButton);

  expect(fetch).toHaveBeenCalledTimes(1);
});
