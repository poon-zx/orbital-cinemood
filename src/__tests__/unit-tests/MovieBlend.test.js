import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from "../../context/AuthProvider.jsx";
import { useParams } from "react-router-dom";
import MovieBlend from "../../pages/Profile/MovieBlend";
import "@testing-library/jest-dom";

jest.mock("../../context/AuthProvider.jsx");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

describe("MovieBlend", () => {
  it("movie blend page renders without crashing", () => {
    useAuth.mockReturnValue({ user: { id: "test-id" } });
    useParams.mockReturnValue({ id: "url-id" });

    render(<MemoryRouter><MovieBlend /></MemoryRouter>);
    expect(screen.getByText(/Movie Blend with/)).toBeInTheDocument();
  });

  it("renders correct message if there's no movie in the watch history", async () => {
    useAuth.mockReturnValue({ user: { id: "test-id" } });
    useParams.mockReturnValue({ id: "url-id" });

    render(<MemoryRouter><MovieBlend /></MemoryRouter>);

    const message = await screen.findByText(/Add movies to your watch history to see movies you may like!/i);
    expect(message).toBeInTheDocument();
  });
});
