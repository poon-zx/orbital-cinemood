import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getSupabaseInstance } from "../../supabase";
import PersonalStats from "../../pages/Profile/PersonalStats";
import "@testing-library/jest-dom";

// Mock the useParams hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // use actual for all non-hook parts
  useParams: () => ({
    id: "mockedUrlId", // replace 'mockedUrlId' with the actual value you want to use for testing
  }),
}));

jest.mock("../../supabase"); // Mock the supabase module

// This will set the timeout for all tests in this file to 10 seconds
jest.setTimeout(10000);

describe("PersonalStats", () => {
  beforeEach(() => {
    jest.resetAllMocks(); // Reset all mocks before each test
  });

  it("should render PersonalStats correctly", async () => {
    const mockData = {
      watched: [],
    };

    const Data = [
      {
        username: "Test User",
        watched: [],
        id: "mockedUrlId",
      },
    ];

    getSupabaseInstance.mockImplementation(() => ({
      from: (tableName) => {
        console.log(`from was called with ${tableName}`);
        return {
          select: (param0) => {
            if (param0 === "*" && tableName === "user") {
              return {
                eq: (param1, param2) =>
                  Promise.resolve({ data: Data, error: null }),
              };
            } else {
              return {
                eq: (param1, param2) => {
                  if (tableName === "user") {
                    return {
                      single: () =>
                        Promise.resolve({ data: mockData, error: null }),
                    };
                  } else if (tableName === "review") {
                    if (param1 === "movie_id") {
                      return {
                        eq: (param3, param4) => {
                          return Promise.resolve({
                            data: [[]],
                            error: null,
                          });
                        },
                      };
                    } else if (param1 === "user_id") {
                      return Promise.resolve({
                        data: [[]],
                        error: null,
                      });
                    }
                  }
                  return Promise.resolve({ data: [], error: null });
                },
              };
            }
          },
        };
      },
    }));

    // Render the component within a router because it uses react-router hooks
    const { getByText } = render(
      <MemoryRouter initialEntries={["/profile/1"]}>
        <PersonalStats />
      </MemoryRouter>
    );

    // Use waitFor to handle async operations
    await waitFor(
      () => {
        expect(getByText("Test User's CineStats")).toBeInTheDocument();
        expect(getByText("Genres")).toBeInTheDocument();
        expect(getByText("Ratings")).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it("should not show anything if no ratings or watched movies", async () => {
    const mockData = {
      watched: [],
    };

    const Data = [
      {
        username: "Test User",
        watched: [],
        id: "mockedUrlId",
      },
    ];

    getSupabaseInstance.mockImplementation(() => ({
      from: (tableName) => {
        console.log(`from was called with ${tableName}`);
        return {
          select: (param0) => {
            if (param0 === "*" && tableName === "user") {
              return {
                eq: (param1, param2) =>
                  Promise.resolve({ data: Data, error: null }),
              };
            } else {
              return {
                eq: (param1, param2) => {
                  if (tableName === "user") {
                    return {
                      single: () =>
                        Promise.resolve({ data: mockData, error: null }),
                    };
                  } else if (tableName === "review") {
                    if (param1 === "movie_id") {
                      return {
                        eq: (param3, param4) => {
                          return Promise.resolve({
                            data: [[]],
                            error: null,
                          });
                        },
                      };
                    } else if (param1 === "user_id") {
                      return Promise.resolve({
                        data: [[]],
                        error: null,
                      });
                    }
                  }
                  return Promise.resolve({ data: [], error: null });
                },
              };
            }
          },
        };
      },
    }));

    // Render the component within a router because it uses react-router hooks
    const { getByText } = render(
      <MemoryRouter initialEntries={["/profile/1"]}>
        <PersonalStats />
      </MemoryRouter>
    );

    // Use waitFor to handle async operations
    await waitFor(
      () => {
        expect(
          getByText("Watch at least 1 movie to unlock genre insights!")
        ).toBeInTheDocument();
        expect(
          getByText("Rate at least 1 movie to unlock rating insights!")
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  // Test to check for render of movie card with testid of "movie-card-done"
  it("should render movie card if at least one movie in watched", async () => {
    const mockData = {
      watched: ["569094"],
    };

    const Data = [
      {
        username: "Test User",
        watched: ["569094"],
        id: "mockedUrlId",
      },
    ];

    getSupabaseInstance.mockImplementation(() => ({
      from: (tableName) => {
        console.log(`from was called with ${tableName}`);
        return {
          select: (param0) => {
            if (param0 === "*" && tableName === "user") {
              return {
                eq: (param1, param2) =>
                  Promise.resolve({ data: Data, error: null }),
              };
            } else {
              return {
                eq: (param1, param2) => {
                  if (tableName === "user") {
                    return {
                      single: () =>
                        Promise.resolve({ data: mockData, error: null }),
                    };
                  } else if (tableName === "review") {
                    if (param1 === "movie_id") {
                      return {
                        eq: (param3, param4) => {
                          return Promise.resolve({
                            data: [[]],
                            error: null,
                          });
                        },
                      };
                    } else if (param1 === "user_id") {
                      return Promise.resolve({
                        data: [[]],
                        error: null,
                      });
                    }
                  }
                  return Promise.resolve({ data: [], error: null });
                },
              };
            }
          },
        };
      },
    }));

    // Render the component within a router because it uses react-router hooks
    const { getByText } = render(
      <MemoryRouter initialEntries={["/profile/1"]}>
        <PersonalStats />
      </MemoryRouter>
    );
    await waitFor(
      () => {
        const movieCards = screen.queryAllByTestId("movie-card-done");
        expect(movieCards.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );
  });

  it("should show ratings section accurately", async () => {
    const mockData = {
      watched: [],
    };

    const Data = [
      {
        username: "Test User",
        watched: [],
        id: "mockedUrlId",
      },
    ];

    getSupabaseInstance.mockImplementation(() => ({
      from: (tableName) => {
        console.log(`from was called with ${tableName}`);
        return {
          select: (param0) => {
            if (param0 === "*" && tableName === "user") {
              return {
                eq: (param1, param2) =>
                  Promise.resolve({ data: Data, error: null }),
              };
            } else {
              return {
                eq: (param1, param2) => {
                  if (tableName === "user") {
                    return {
                      single: () =>
                        Promise.resolve({ data: mockData, error: null }),
                    };
                  } else if (tableName === "review") {
                    if (param1 === "movie_id") {
                      return {
                        eq: (param3, param4) => {
                          return Promise.resolve({
                            data: [
                              {
                                content: "Test review",
                                created_at: "test",
                                id: "1",
                                movie_id: "569094",
                                rating: 8,
                                title: "Test movie",
                                user_id: "1",
                              },
                            ],
                            error: null,
                          });
                        },
                      };
                    } else if (param1 === "user_id") {
                      return Promise.resolve({
                        data: [
                          [
                            {
                              content: "Test review",
                              created_at: "test",
                              id: "1",
                              movie_id: "569094",
                              rating: 8,
                              title: "Test movie",
                              user_id: "1",
                            },
                          ],
                        ],
                        error: null,
                      });
                    }
                  }
                  return Promise.resolve({ data: [], error: null });
                },
              };
            }
          },
        };
      },
    }));

    // Render the component within a router because it uses react-router hooks
    const { getByText } = render(
      <MemoryRouter initialEntries={["/profile/1"]}>
        <PersonalStats />
      </MemoryRouter>
    );

    // Use waitFor to handle async operations
    await waitFor(
      () => {
        expect(getByText("Your average rating is 8.00 ⭐")).toBeInTheDocument();
        expect(
          getByText(
            /You gave this movie 8 stars, and the TMDB vote average was /
          )
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });
});
