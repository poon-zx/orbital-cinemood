import React from 'react';
import { render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import Watch from '../modals/watch';

it('should open the modal when button is clicked', async () => {
    const { getByText } = render(
        <MemoryRouter>
            <Watch movieId={1} />
        </MemoryRouter>
    );

    const openModalButton = getByText('Add this movie');
    fireEvent.click(openModalButton);

    await waitFor(() => {
        expect(getByText('Have you watched this movie?')).toBeInTheDocument();
    });
});

it('renders the action buttons correctly when movie not in watchlist or history', () => {
    const { getByText } = render(
        <MemoryRouter>
            <Watch movieId={1} />
        </MemoryRouter>
    );

    fireEvent.click(getByText('Add this movie')); // Open the modal

    expect(getByText('Add to watchlist')).toBeInTheDocument();
    expect(getByText('Add to watch history')).toBeInTheDocument();
});

