import {describe, it, expect, vi} from 'vitest';
import {render, screen, waitFor} from '@testing-library/react';
import {AppContent} from '@client/app';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useAuth} from '@client/contexts/auth-context';
import {AuthProvider} from '@client/contexts/auth-provider';
import {ThemeProvider} from '@client/contexts/theme-provider';
import {MemoryRouter} from 'react-router-dom';

const queryClient = new QueryClient({
	defaultOptions: {queries: {retry: false}},
});

describe('App Routing', () => {
	it('renders login page by default when not authenticated', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

		render(
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<MemoryRouter initialEntries={['/']}>
							<AppContent />
						</MemoryRouter>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByRole('heading', {name: /login/i})).toBeDefined();
		});
	});

	it('renders home page when authenticated', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
			JSON.stringify({
				username: 'admin',
				password: 'secret',
				fullName: 'Admin',
			}),
		);

		render(
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<MemoryRouter initialEntries={['/']}>
							<AppContent />
						</MemoryRouter>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByText(/welcome to the spa demonstration/i)).toBeDefined();
		});
	});

	it('handles invalid localstorage data', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('invalid-json');

		render(
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<MemoryRouter initialEntries={['/']}>
							<AppContent />
						</MemoryRouter>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByRole('heading', {name: /login/i})).toBeDefined();
		});
	});

	it('handles empty localstorage data', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');

		render(
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<MemoryRouter initialEntries={['/']}>
							<AppContent />
						</MemoryRouter>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByRole('heading', {name: /login/i})).toBeDefined();
		});
	});

	it('handles valid but falsy localstorage data', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('null');

		render(
			<ThemeProvider>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<MemoryRouter initialEntries={['/']}>
							<AppContent />
						</MemoryRouter>
					</AuthProvider>
				</QueryClientProvider>
			</ThemeProvider>,
		);

		await waitFor(() => {
			expect(screen.getByRole('heading', {name: /login/i})).toBeDefined();
		});
	});

	it('useAuth throws error when used outside of AuthProvider', () => {
		const TestComponent = () => {
			useAuth();
			return null;
		};

		// Silence console.error for this test
		vi.spyOn(console, 'error').mockImplementation(() => {});

		expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider');
	});

	it('renders children in AuthProvider', () => {
		render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<div>Child</div>
				</AuthProvider>
			</QueryClientProvider>,
		);
		expect(screen.getByText('Child')).toBeDefined();
	});

	it('isAuthenticated handles non-null user', async () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(
			JSON.stringify({
				username: 'test',
				password: 'password',
				fullName: 'Test User',
			}),
		);

		const TestStatus = () => {
			const {isAuthenticated} = useAuth();
			return <div>{isAuthenticated ? 'AUTH' : 'NOAUTH'}</div>;
		};

		render(
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<TestStatus />
				</AuthProvider>
			</QueryClientProvider>,
		);

		expect(screen.getByText('AUTH')).toBeDefined();
	});
});
