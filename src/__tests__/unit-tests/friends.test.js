import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthContext } from "../../context/AuthProvider.jsx";
import { getSupabaseInstance } from "../../supabase.js";
import Friends from "../../pages/Friends/friends.js";
import SearchFriends from "../../modals/searchFriends.js";
import '@testing-library/jest-dom'

jest.mock("../../supabase.js");

test("renders Friends", async () => {
  const mockUserData = [
    {
      id: "user1",
      friends: ["friend1", "friend2"],
      // Other user properties...
    },
  ];

  const mockFriendData = [
    {
      id: "friend1",
      username: "friend1"
    },
    {
      id: "friend2",
        username: "friend2"
    },
  ];

  getSupabaseInstance.mockImplementation(() => ({
    from: (tableName) => ({
      select: () => ({
        eq: () => ({
          in: () => {
            if (tableName === "user") {
              return Promise.resolve({ data: mockUserData, error: null });
            } else if (tableName === "friends") {
              return Promise.resolve({ data: mockFriendData, error: null });
            }
          },
        }),
      }),
    }),
  }));

  render(
    <AuthContext.Provider
      value={{
        auth: true,
        user: {
          id: "user1",
        },
        updatePassword: jest.fn(),
      }}
    >
        <SearchFriends />
      <Friends />
    </AuthContext.Provider>
  );

  await waitFor(() => {
    // Check that the Friends header is rendered
    expect(screen.getByText("Friends")).toBeInTheDocument();
    expect(screen.getByText("No friends yet")).toBeInTheDocument();
  });
});
