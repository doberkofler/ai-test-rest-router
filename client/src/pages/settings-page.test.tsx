import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {SettingsPage} from '@client/pages/settings-page';
import {TestWrapper} from '@client/test/test-wrapper';

describe('SettingsPage', () => {
	it('renders settings sections', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			expect(screen.getByRole('heading', {name: /appearance/i})).toBeDefined();
			expect(screen.getByRole('heading', {name: /server options/i})).toBeDefined();
		});
	});

	it('can change theme to light, dark, system', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const darkBtn = screen.getByRole('button', {name: /dark/i});
			fireEvent.click(darkBtn);
			expect(globalThis.document.documentElement.classList.contains('dark')).toBe(true);

			const lightBtn = screen.getByRole('button', {name: /light/i});
			fireEvent.click(lightBtn);
			expect(globalThis.document.documentElement.classList.contains('light')).toBe(true);

			const systemBtn = screen.getByRole('button', {name: /system/i});
			fireEvent.click(systemBtn);
		});
	});

	it('triggers system theme change listener', async () => {
		let listener: ((e: any) => void) | null = null;
		vi.spyOn(globalThis, 'matchMedia').mockImplementation(
			(query) =>
				({
					matches: true, // System is dark
					media: query,
					onchange: null,
					addEventListener: vi.fn((type, cb) => {
						if (type === 'change') listener = cb;
					}),
					removeEventListener: vi.fn(),
					dispatchEvent: vi.fn(),
				}) as any,
		);

		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const systemBtn = screen.getByRole('button', {name: /system/i});
			fireEvent.click(systemBtn);
		});

		if (listener) {
			(listener as any)({matches: true});
			expect(globalThis.document.documentElement.classList.contains('dark')).toBe(true);
		}
	});

	it('can update server timeout', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({sessionTimeoutMinutes: 60}),
			} as Response)
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({sessionTimeoutMinutes: 120}),
			} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const input = screen.getByLabelText(/session timeout/i);
			fireEvent.change(input, {target: {value: '120'}});
			const saveBtn = screen.getByRole('button', {name: /save settings/i});
			fireEvent.click(saveBtn);
		});

		await waitFor(() => {
			expect(screen.getByText((content) => content.toLowerCase().includes('updated successfully'))).toBeDefined();
		});
	});

	it('handles update failure', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({sessionTimeoutMinutes: 60}),
			} as Response)
			.mockResolvedValueOnce({
				ok: false,
				status: 400,
				json: async () => ({error: 'Failed to update settings'}),
			} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const input = screen.getByLabelText(/session timeout/i);
			fireEvent.change(input, {target: {value: '120'}});
			const saveBtn = screen.getByRole('button', {name: /save settings/i});
			fireEvent.click(saveBtn);
		});

		await waitFor(() => {
			expect(screen.getByText((content) => content.toLowerCase().includes('failed to update'))).toBeDefined();
		});
	});

	it('handles non-Error update failure', async () => {
		vi.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce({
				ok: true,
				json: async () => ({sessionTimeoutMinutes: 60}),
			} as Response)
			.mockRejectedValueOnce(new Error('Update failed'));

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const input = screen.getByLabelText(/session timeout/i);
			fireEvent.change(input, {target: {value: '120'}});
			const saveBtn = screen.getByRole('button', {name: /save settings/i});
			fireEvent.click(saveBtn);
		});

		await waitFor(() => {
			expect(screen.getByText('Update failed')).toBeDefined();
		});
	});

	it('validates timeout input', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const input = screen.getByLabelText(/session timeout/i);
			fireEvent.change(input, {target: {value: '0'}}); // Too small
			const saveBtn = screen.getByRole('button', {name: /save settings/i});
			fireEvent.click(saveBtn);
			expect(screen.getByText(/must be between/i)).toBeDefined();
		});
	});

	it('validates timeout input (large)', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			const input = screen.getByLabelText(/session timeout/i);
			fireEvent.change(input, {target: {value: '1441'}}); // Too large
			const saveBtn = screen.getByRole('button', {name: /save settings/i});
			fireEvent.click(saveBtn);
			expect(screen.getByText(/must be between/i)).toBeDefined();
		});
	});

	it('validates timeout input (NaN)', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		const input = await screen.findByLabelText(/session timeout/i);
		fireEvent.change(input, {target: {value: 'abc'}});

		const saveBtn = await screen.findByRole('button', {name: /save settings/i});
		fireEvent.click(saveBtn);

		await waitFor(() => {
			expect(screen.getByText(/must be between/i)).toBeDefined();
		});
	});

	it('initializes theme from localstorage', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});
		await waitFor(() => {
			expect(globalThis.document.documentElement.classList.contains('light')).toBe(true);
		});
	});

	it('initializes theme from localstorage (dark)', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('dark');
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});
		await waitFor(() => {
			expect(globalThis.document.documentElement.classList.contains('dark')).toBe(true);
		});
	});

	it('handles system theme initialization', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('system');
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});
		await waitFor(() => {
			expect(screen.getByRole('button', {name: /system/i})).toBeDefined();
		});
	});

	it('handles fetch failure', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: false,
			status: 500,
			json: async () => ({error: 'Error loading options'}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});

		await waitFor(() => {
			expect(screen.getByText(/error loading options/i)).toBeDefined();
		});
	});

	it('handles empty options data', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => null,
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});
		await waitFor(() => {
			expect(screen.getByText(/loading options/i)).toBeDefined();
		});
	});

	it('handles non-existent theme in localstorage', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid');
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: true,
			json: async () => ({sessionTimeoutMinutes: 60}),
		} as Response);

		render(<SettingsPage />, {wrapper: TestWrapper});
		await waitFor(() => {
			expect(screen.getByRole('button', {name: /system/i})).toBeDefined();
		});
	});
});
