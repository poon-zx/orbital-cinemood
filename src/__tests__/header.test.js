import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  MemoryRouter,
  useLocation,
  BrowserRouter,
} from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "../components/Header/header.js";
import { SearchContext } from "../context/SearchContext.js"; // import your SearchContext
import { act } from "react-dom/test-utils";
import { createMemoryHistory } from "history";

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
      expect(
        screen.getByRole("link", { name: "Top Rated" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Upcoming" })
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("search movie name...")
      ).toBeInTheDocument();
    });
  });

  test("clicking home logo redirects to home page", () => {
    const history = createMemoryHistory();

    global.window = { location: { pathname: null } };

    render(
      <BrowserRouter history={history}>
        <SearchContext.Provider value={{ mockSetSearchText }}>
          <Header />
        </SearchContext.Provider>
      </BrowserRouter>
    );

    const logo = screen.getByAltText("Home");
    fireEvent.click(logo);

    // Check if the URL is changed to "/home" after clicking the home logo
    expect(global.window.location.pathname).toBe("/home");
  });

  test("clicking Popular redirects to Popular movies page", async () => {
    render(
      <BrowserRouter>
        <SearchContext.Provider value={{ setSearchText: mockSetSearchText }}>
          <RouterWrapper>
            <Header />
          </RouterWrapper>
        </SearchContext.Provider>
      </BrowserRouter>
    );

    const popularButton = screen.getAllByText("Popular")[0];
    fireEvent.click(popularButton);

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "/movies/popular"
    );
  });

  test("clicking Top Rated redirects to Top Rated movies page", async () => {
    render(
      <BrowserRouter>
        <SearchContext.Provider value={{ setSearchText: mockSetSearchText }}>
          <RouterWrapper>
            <Header />
          </RouterWrapper>
        </SearchContext.Provider>
      </BrowserRouter>
    );

    const popularButton = screen.getAllByText("Top Rated")[0];
    fireEvent.click(popularButton);

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "/movies/top_rated"
    );
  });

  test("clicking Upcoming redirects to Upcoming movies page", async () => {
    render(
      <BrowserRouter>
        <SearchContext.Provider value={{ setSearchText: mockSetSearchText }}>
          <RouterWrapper>
            <Header />
          </RouterWrapper>
        </SearchContext.Provider>
      </BrowserRouter>
    );

    const popularButton = screen.getAllByText("Upcoming")[0];
    fireEvent.click(popularButton);

    expect(screen.getByTestId("location-display")).toHaveTextContent(
      "/movies/upcoming"
    );
  });

  test("navigates to the search page when Search link is clicked", () => {
    const setSearchText = jest.fn();

    render(
      <MemoryRouter>
        <SearchContext.Provider value={{ setSearchText }}>
          <Header />
        </SearchContext.Provider>
      </MemoryRouter>
    );

    act(() => {
      userEvent.type(
        screen.getByPlaceholderText("search movie name..."),
        "test search query"
      );
      userEvent.click(screen.getByRole("search-button"));
    });

    expect(setSearchText).toHaveBeenCalledWith("test search query");
  });
});
