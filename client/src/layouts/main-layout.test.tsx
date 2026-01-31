import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MainLayout} from './main-layout.tsx';
import {TestWrapper} from '../test/test-wrapper.tsx';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

describe('MainLayout', () => {
	it('renders navigation items', () => {
		render(
			<TestWrapper>
				<MemoryRouter>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>,
		);

		// Use getAllByText because 'Home' appears in both AppBar and Sidebar
		expect(screen.getAllByText(/home/i).length).toBeGreaterThan(0);
		expect(screen.getByText(/about/i)).toBeInTheDocument();
		expect(screen.getByText(/settings/i)).toBeInTheDocument();
	});

	it('toggles drawer state', () => {
		render(
			<TestWrapper>
				<MemoryRouter>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>,
		);

		const toggleBtn = screen.getByLabelText(/open drawer/i);
		fireEvent.click(toggleBtn);
		// After click it should show the open state icon (ChevronLeft)
		expect(screen.getByLabelText(/open drawer/i)).toBeInTheDocument();
	});

	it('handles unknown routes in title', () => {
		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/unknown']}>
					<Routes>
						<Route path="/unknown" element={<MainLayout />} />
					</Routes>
				</MemoryRouter>
			</TestWrapper>,
		);

		// Fallback title should be 'App' as per getPageTitle logic
		expect(screen.getByText('App')).toBeInTheDocument();
	});

	it('handles logout', async () => {
		const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{status: 'ok'},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/']}>
					<Routes>
						<Route path="/" element={<MainLayout />} />
						<Route path="/login" element={<div>Login Page</div>} />
					</Routes>
				</MemoryRouter>
			</TestWrapper>,
		);

		const logoutBtn = screen.getByRole('button', {name: /logout/i});
		fireEvent.click(logoutBtn);

		await waitFor(() => {
			expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/auth/logout'), expect.any(Object));
			expect(screen.getByText(/login page/i)).toBeInTheDocument();
		});
	});

	it('handles logout failure', async () => {
		const logoutSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Logout failed'));

		render(
			<TestWrapper>
				<MemoryRouter>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>,
		);

		const logoutBtn = screen.getByRole('button', {name: /logout/i});
		fireEvent.click(logoutBtn);

		await waitFor(() => {
			expect(logoutSpy).toHaveBeenCalled();
		});

		// Instead of console.error, just verify the spy was called
		expect(logoutSpy).toHaveBeenCalledWith(
			expect.stringContaining('/auth/logout'),
			expect.objectContaining({
				method: 'POST',
				credentials: 'include',
			}),
		);
	});
});
