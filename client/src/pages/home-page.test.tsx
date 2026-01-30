import {describe, it, expect, vi} from 'vitest';
import {render, screen} from '@testing-library/react';
import {HomePage} from '../pages/home-page';
import {TestWrapper} from '../test/test-wrapper';

describe('HomePage', () => {
	it('renders home heading', () => {
		render(<HomePage />, {wrapper: TestWrapper});
		expect(screen.getByText('Home')).toBeDefined();
	});

	it('renders welcome message', () => {
		render(<HomePage />, {wrapper: TestWrapper});
		expect(screen.getByText(/Welcome to the SPA demonstration/i)).toBeDefined();
	});

	it('handles non-existent user state', () => {
		vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
		render(<HomePage />, {wrapper: TestWrapper});
		expect(screen.getByText('Home')).toBeDefined();
	});
});
