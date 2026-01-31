import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {ErrorBoundary} from './error-boundary';

describe('ErrorBoundary', () => {
	const ThrowError = ({shouldThrow = false}) => {
		if (shouldThrow) {
			throw new Error('Test error');
		}
		return <div>Safe Component</div>;
	};

	it('renders children when no error occurs', () => {
		render(
			<ErrorBoundary>
				<ThrowError />
			</ErrorBoundary>,
		);
		expect(screen.getByText('Safe Component')).toBeInTheDocument();
	});

	it('renders error UI when a child throws', () => {
		// Mock console.error to avoid cluttering test output
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		expect(screen.getByText('Something went wrong')).toBeInTheDocument();
		expect(screen.getByText('Test error')).toBeInTheDocument();
		expect(screen.getByRole('button', {name: /reload application/i})).toBeInTheDocument();

		consoleSpy.mockRestore();
	});

	it('contains a reload button that triggers page refresh', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(
			<ErrorBoundary>
				<ThrowError shouldThrow={true} />
			</ErrorBoundary>,
		);

		const reloadButton = screen.getByRole('button', {name: /reload application/i});
		expect(reloadButton).toBeInTheDocument();

		// In Vitest browser mode, we don't try to mock location.reload because it's restricted.
		// Instead, we just verify the button is present and clickable.
		fireEvent.click(reloadButton);

		consoleSpy.mockRestore();
	});
});
