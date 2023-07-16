import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { MemoryRouter, useLocation } from "react-router-dom";
import App from "../../App.js";


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

function RouterWrapper({ children }) {
  const location = useLocation();
  return (
    <div>
      <div data-testid="location-display">{location.pathname}</div>
      {children}
    </div>
  );
}

 
test("submits form and calls search function", async () => {
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
  const searchInput = screen.getByPlaceholderText(/I want to watch a .../i);
  const searchButton = screen.getByTestId("search-button");

  fireEvent.change(searchInput, { target: { value: "action" } });
  fireEvent.click(searchButton);

  expect(fetch).toHaveBeenCalledTimes(1);
});