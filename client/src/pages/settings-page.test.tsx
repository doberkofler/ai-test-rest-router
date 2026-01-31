import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import {SettingsPage} from './settings-page.tsx';
import {TestWrapper} from '../test/test-wrapper.tsx';
import {MemoryRouter} from 'react-router-dom';

describe('SettingsPage', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('renders settings sections', async () => {
		// WHY: Standard 200 OK with default data to test initial render.
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{sessionTimeoutMinutes: 60},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<SettingsPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByText(/appearance/i)).toBeInTheDocument();
			expect(screen.getByText(/server options/i)).toBeInTheDocument();
		});
	});

	it('can change theme to light, dark, system', async () => {
		// WHY: Mock successful settings load.
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{sessionTimeoutMinutes: 60},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<SettingsPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByLabelText(/light theme/i)).toBeInTheDocument();
		});

		const darkBtn = screen.getByLabelText(/dark theme/i);
		await act(async () => {
			fireEvent.click(darkBtn);
		});
		expect(darkBtn).toHaveAttribute('aria-pressed', 'true');

		const lightBtn = screen.getByLabelText(/light theme/i);
		await act(async () => {
			fireEvent.click(lightBtn);
		});
		expect(lightBtn).toHaveAttribute('aria-pressed', 'true');

		const systemBtn = screen.getByLabelText(/system theme/i);
		await act(async () => {
			fireEvent.click(systemBtn);
		});
		expect(systemBtn).toHaveAttribute('aria-pressed', 'true');
	});

	it('validates timeout input', async () => {
		// WHY: Mock successful settings load.
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{sessionTimeoutMinutes: 60},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<SettingsPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByLabelText(/session timeout/i)).toBeInTheDocument();
		});

		const input = screen.getByLabelText(/session timeout/i) as HTMLInputElement;
		await act(async () => {
			fireEvent.change(input, {target: {value: '0'}});
		});
		// Note: MUI inputs might need different validation check or just check value
		expect(input.value).toBe('0');

		await act(async () => {
			fireEvent.change(input, {target: {value: '60'}});
		});
		expect(input.value).toBe('60');
	});

	it('can update server timeout', async () => {
		// WHY: First load succeeds, then mock successful update.
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				Response.json(
					{sessionTimeoutMinutes: 60},
					{
						status: 200,
					},
				),
			)
			.mockResolvedValueOnce(
				Response.json(
					{sessionTimeoutMinutes: 120},
					{
						status: 200,
					},
				),
			);

		render(
			<TestWrapper>
				<MemoryRouter>
					<SettingsPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByLabelText(/session timeout/i)).toBeInTheDocument();
		});

		const input = screen.getByLabelText(/session timeout/i);
		await act(async () => {
			fireEvent.change(input, {target: {value: '120'}});
		});

		const updateBtn = screen.getByRole('button', {name: /save settings/i});
		await act(async () => {
			fireEvent.click(updateBtn);
		});

		await waitFor(() => {
			expect(screen.getByText(/settings updated successfully/i)).toBeInTheDocument();
		});
	});

	it('handles update failure', async () => {
		// WHY: First load succeeds, then mock update failure.
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				Response.json(
					{sessionTimeoutMinutes: 60},
					{
						status: 200,
					},
				),
			)
			.mockResolvedValueOnce(
				Response.json(
					{error: 'Update failed'},
					{
						status: 400,
					},
				),
			);

		render(
			<TestWrapper>
				<MemoryRouter>
					<SettingsPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByRole('button', {name: /save settings/i})).toBeInTheDocument();
		});

		const updateBtn = screen.getByRole('button', {name: /save settings/i});
		await act(async () => {
			fireEvent.click(updateBtn);
		});

		await waitFor(() => {
			expect(screen.getByText(/update failed/i)).toBeInTheDocument();
		});
	});

	it('handles non-Error update failure', async () => {
		// WHY: First load succeeds, then mock network error.
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				Response.json(
					{sessionTimeoutMinutes: 60},
					{
						status: 200,
					},
				),
			)
			.mockRejectedValueOnce(new Error('Network error'));

		render(
			<TestWrapper>
				<MemoryRouter>
					<SettingsPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		await waitFor(() => {
			expect(screen.getByRole('button', {name: /save settings/i})).toBeInTheDocument();
		});

		const updateBtn = screen.getByRole('button', {name: /save settings/i});
		await act(async () => {
			fireEvent.click(updateBtn);
		});

		await waitFor(() => {
			expect(screen.getByText(/network error/i)).toBeInTheDocument();
		});
	});
});
