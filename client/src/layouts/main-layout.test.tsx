import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {MainLayout} from '../layouts/main-layout';
import {TestWrapper} from '../test/test-wrapper';
import {MemoryRouter} from 'react-router-dom';

describe('MainLayout', () => {
	it('handles logout', async () => {
		const logoutSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({status: 'ok'})
		} as Response);

		render(
			<TestWrapper>
				<MemoryRouter>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>
		);

		const logoutBtn = screen.getByRole('button', {name: /logout/i});
		fireEvent.click(logoutBtn);

		await waitFor(() => {
			expect(logoutSpy).toHaveBeenCalled();
		});
	});

	it('handles logout failure', async () => {
		const logoutSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Logout failed'));

		render(
			<TestWrapper>
				<MemoryRouter>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>
		);

		const logoutBtn = screen.getByRole('button', {name: /logout/i});
		fireEvent.click(logoutBtn);

		await waitFor(() => {
			expect(logoutSpy).toHaveBeenCalled();
		});
	});

	it('highlights active links', () => {
		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/']}>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>
		);
		
		const homeLink = screen.getByRole('link', { name: /home/i });
		expect(homeLink.className).toContain('active');
	});

	it('highlights about link', () => {
		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/about']}>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>
		);
		
		const aboutLink = screen.getByRole('link', { name: /about/i });
		expect(aboutLink.className).toContain('active');
	});

	it('highlights settings link', () => {
		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/settings']}>
					<MainLayout />
				</MemoryRouter>
			</TestWrapper>
		);
		
		const settingsLink = screen.getByRole('link', { name: /settings/i });
		expect(settingsLink.className).toContain('active');
	});
});
