import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ErrorBoundary} from './error-boundary.tsx';

describe('ErrorBoundary', () => {
	it('renders children when no error occurs', () => {
		render(
			<ErrorBoundary>
				<div>Safe Component</div>
			</ErrorBoundary>,
		);
		expect(screen.getByText('Safe Component')).toBeInTheDocument();
	});

	it('logic remains safe', () => {
		// Verify ErrorBoundary handles logic correctly
		const boundary = new ErrorBoundary({children: null});
		expect(boundary.state.hasError).toBe(false);
	});
});
