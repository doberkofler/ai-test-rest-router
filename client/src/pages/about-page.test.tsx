import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {AboutPage} from './about-page.tsx';
import {TestWrapper} from '../test/test-wrapper.tsx';
import {MemoryRouter} from 'react-router-dom';

describe('AboutPage', () => {
	it('renders headings', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{
					startTimestamp: new Date().toISOString(),
					serverTime: new Date().toISOString(),
					nodeVersion: 'v24.0.0',
					expressVersion: '5.0.0',
					user: {
						username: 'admin-user',
						fullName: 'Admin Full Name',
						loginTimestamp: new Date().toISOString(),
					},
				},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<AboutPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByRole('heading', {name: 'About'})).toBeDefined();
			// Find by test content substring
			expect(screen.getByText(/v24\.0\.0/i)).toBeDefined();
		});
	});

	it('handles fetch error', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response('Plain text error', {
				status: 500,
			}),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<AboutPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByText(/http error/i)).toBeDefined();
		});
	});

	it('renders without user session', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{
					startTimestamp: new Date().toISOString(),
					serverTime: new Date().toISOString(),
					nodeVersion: 'v24.0.0',
					expressVersion: '5.0.0',
					user: null,
				},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<AboutPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByText(/server information/i)).toBeDefined();
			// Explicitly check that the session info list is NOT rendered
			expect(screen.queryByText(/session created/i)).toBeNull();
		});
	});

	it('handles data being an empty object', async () => {
		// WHY: Simulate a 200 OK with empty object to test defensive UI handling.
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<AboutPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			// WHY: Both Zod validation failure and explicit UI fallback may trigger alerts.
			expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
		});
	});
});
