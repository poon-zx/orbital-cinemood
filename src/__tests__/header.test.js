import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation, Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header/header.js";
import { SearchContext } from "../context/SearchContext.js"; // import your SearchContext
import { act } from "react-dom/test-utils";

// mock setSearchText function
const mockSetSearchText = jest.fn();

function RouterWrapper({ children }) {
  const location = useLocation();
  return (
    <div>
      <div data-testid="location-display">{location.pathname}</div>
      {children}
    </div>
  );
}

describe("Header", () => {
  it("renders correctly", () => {
    render(
      <MemoryRouter>
        <SearchContext.Provider value={{ setSearchText: mockSetSearchText }}>
          <Header />
        </SearchContext.Provider>
      </MemoryRouter>
    );

    act(() => {
    expect(screen.getByAltText("Home")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Popular" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Top Rated" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Upcoming" })).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("search movie name...")
    ).toBeInTheDocument();
    });
  });

  it("navigates to the home page when Home link is clicked", () => {
    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchContext.Provider value={{ setSearchText: mockSetSearchText }}>
          <RouterWrapper>
            <Header />
          </RouterWrapper>
        </SearchContext.Provider>
      </MemoryRouter>
    );

    act(() => {
    userEvent.click(screen.getByAltText("Home"));
    expect(screen.getByTestId("location-display")).toHaveTextContent("/");
    });
  });

  test('navigates to the search page when Search link is clicked', () => {
    const setSearchText = jest.fn();
  
    render(
      <MemoryRouter>
        <SearchContext.Provider value={{ setSearchText }}>
          <Header />
        </SearchContext.Provider>
      </MemoryRouter>
    );
  
    act(() => {
    userEvent.type(screen.getByPlaceholderText('search movie name...'), 'test search query');
    userEvent.click(screen.getByRole('search-button'));
    });
  
    expect(setSearchText).toHaveBeenCalledWith('test search query');
  });
});
