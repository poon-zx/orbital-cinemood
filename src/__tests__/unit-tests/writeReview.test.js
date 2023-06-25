import {
    render,
    screen,
    fireEvent
  } from "@testing-library/react";
  import '@testing-library/jest-dom'
  import { MemoryRouter } from "react-router-dom";
import WriteReview from "../../modals/writeReview";
  
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <WriteReview movieId="123" />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Write a Review"));
    expect(screen.getByText("Write a Review!")).toBeInTheDocument();
    expect(screen.getByText("Your Review")).toBeInTheDocument();
  });
  