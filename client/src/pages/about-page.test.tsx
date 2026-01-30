import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {AboutPage} from '../pages/about-page';
import {TestWrapper} from '../test/test-wrapper';

describe('AboutPage', () => {
	it('renders headings', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				startTimestamp: new Date().toISOString(),
				serverTime: new Date().toISOString(),
				nodeVersion: 'v24.0.0',
				expressVersion: '5.0.0',
				user: {
					username: 'admin-user',
					fullName: 'Admin Full Name',
					loginTimestamp: new Date().toISOString()
				}
			})
		} as Response);

		render(<AboutPage />, {wrapper: TestWrapper});
		expect(screen.getByRole('heading', {name: 'About'})).toBeDefined();
		
		await waitFor(() => {
			// Find by test content substring
			expect(screen.getByText(/v24\.0\.0/i)).toBeDefined();
		});
	});

	it('handles fetch error', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error'
		} as Response);

		render(<AboutPage />, {wrapper: TestWrapper});
		
		await waitFor(() => {
			expect(screen.getByText(/http error/i)).toBeDefined();
		});
	});

	it('renders without user session', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				startTimestamp: new Date().toISOString(),
				serverTime: new Date().toISOString(),
				nodeVersion: 'v24.0.0',
				expressVersion: '5.0.0',
				user: null
			})
		} as Response);

		render(<AboutPage />, {wrapper: TestWrapper});
		
		await waitFor(() => {
			expect(screen.getByText(/server information/i)).toBeDefined();
			// Explicitly check that the user list is NOT rendered
			expect(screen.queryByText(/login timestamp/i)).toBeNull();
		});
	});

	it('handles data being undefined', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => undefined
		} as Response);

		render(<AboutPage />, {wrapper: TestWrapper});
		
		await waitFor(() => {
			expect(screen.getByText(/error:/i)).toBeDefined();
		});
	});
});
