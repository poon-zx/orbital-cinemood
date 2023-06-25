import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../pages/Profile/Profile';
import '@testing-library/jest-dom'

jest.mock('../context/AuthProvider.jsx', () => ({
    useAuth: () => ({
      user: { id: '123' },
    }),
  }));

describe('Profile', () => {
  test('renders Profile component without crashing', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
  });

  test('renders user profile information', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );
    
    // Here you can add checks for any expected text or other elements to be present. 
    // For example:
    expect(screen.getByText('display name')).toBeInTheDocument();
    expect(screen.getByText('Watchlist')).toBeInTheDocument();
    expect(screen.getByText('Watch history')).toBeInTheDocument();
  });

  test('edit button toggles input and buttons for username editing', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const editButton = screen.getByTestId('edit-btn');
    fireEvent.click(editButton);

    const usernameInput = screen.getByRole('textbox');
    const saveButton = screen.getByRole('button', { name: /save/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    expect(usernameInput).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });
});
