import {
  render,
  screen, 
  fireEvent
} from "@testing-library/react";
import '@testing-library/jest-dom'
import Rate from "../modals/rating";
import { MemoryRouter } from "react-router-dom";


jest.mock("../supabase.js");

test("renders without crashing", () => {
  render(
    <MemoryRouter>
      <Rate movieId="123" />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByTestId("rate-btn"));
  expect(screen.getByText("Rate this")).toBeInTheDocument();
});
