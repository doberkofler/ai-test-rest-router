import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {LoginPage} from './login-page.tsx';
import {TestWrapper} from '../test/test-wrapper.tsx';
import {MemoryRouter, Routes, Route} from 'react-router-dom';

describe('LoginPage', () => {
	it('renders login form', () => {
		render(
			<TestWrapper>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</TestWrapper>,
		);
		// Check for the heading explicitly
		expect(screen.getByRole('heading', {name: /login/i})).toBeDefined();
		expect(screen.getByLabelText(/username/i)).toBeDefined();
		expect(screen.getByLabelText(/password/i)).toBeDefined();
	});

	it('handles input changes', () => {
		render(
			<TestWrapper>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</TestWrapper>,
		);
		const userIn = screen.getByLabelText(/username/i) as HTMLInputElement;
		const passIn = screen.getByLabelText(/password/i) as HTMLInputElement;

		fireEvent.change(userIn, {target: {value: 'testuser'}});
		fireEvent.change(passIn, {target: {value: 'testpass'}});

		expect(userIn.value).toBe('testuser');
		expect(passIn.value).toBe('testpass');
	});

	it('toggles theme', () => {
		render(
			<TestWrapper>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		const themeBtn = screen.getByRole('button', {name: /switch to/i});
		const initialLabel = themeBtn.getAttribute('aria-label') ?? '';

		fireEvent.click(themeBtn);

		const updatedLabel = screen.getByRole('button', {name: /switch to/i}).getAttribute('aria-label') ?? '';
		expect(updatedLabel).not.toBe(initialLabel);
	});

	it('shows error on failed login', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{error: 'Invalid credentials'},
				{
					status: 401,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		fireEvent.click(screen.getByRole('button', {name: /sign in/i}));

		await waitFor(() => {
			expect(screen.getByText('Invalid credentials')).toBeDefined();
		});
	});

	it('handles failed login response without error message', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{error: 'Login failed'},
				{
					status: 400,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		fireEvent.click(screen.getByRole('button', {name: /sign in/i}));

		await waitFor(() => {
			expect(screen.getByText('Login failed')).toBeDefined();
		});
	});

	it('redirects on success', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{username: 'admin', fullName: 'Admin'},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/login']}>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/" element={<div>Home Dashboard</div>} />
					</Routes>
				</MemoryRouter>
			</TestWrapper>,
		);

		fireEvent.click(screen.getByRole('button', {name: /sign in/i}));

		await waitFor(() => {
			expect(screen.getByText(/home dashboard/i)).toBeDefined();
		});
	});

	it('shows error on status not ok and no json', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response('Plain text error', {
				status: 500,
			}),
		);

		render(
			<TestWrapper>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</TestWrapper>,
		);

		fireEvent.click(screen.getByRole('button', {name: /sign in/i}));

		await waitFor(() => {
			expect(screen.getByText('HTTP error! status: 500')).toBeDefined();
		});
	});

	it('redirects to root when state is null', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			Response.json(
				{username: 'admin', fullName: 'Admin'},
				{
					status: 200,
				},
			),
		);

		render(
			<TestWrapper>
				<MemoryRouter initialEntries={['/login']} initialIndex={0}>
					<Routes>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/" element={<div>Root Page</div>} />
					</Routes>
				</MemoryRouter>
			</TestWrapper>,
		);

		fireEvent.click(screen.getByRole('button', {name: /sign in/i}));

		await waitFor(() => {
			expect(screen.getByText(/root page/i)).toBeDefined();
		});
	});
});
