import {Component} from 'react';
import type {ErrorInfo, ReactNode} from 'react';
import {Box, Typography, Button, Paper} from '@mui/material';

type Props = {
	children: ReactNode;
};

type State = {
	hasError: boolean;
	error: Error | null;
};

/**
 * Error boundary component to catch and display UI errors.
 */
export class ErrorBoundary extends Component<Props, State> {
	public override state: State = {
		hasError: false,
		error: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return {hasError: true, error};
	}

	public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);
	}

	public override render() {
		if (this.state.hasError) {
			return (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100vh',
						p: 3,
						bgcolor: 'background.default',
					}}
				>
					<Paper sx={{p: 4, maxWidth: 500, textAlign: 'center'}}>
						<Typography variant="h5" color="error" gutterBottom>
							Something went wrong
						</Typography>
						<Typography variant="body1" sx={{mb: 3}}>
							{this.state.error?.message ?? 'An unexpected error occurred.'}
						</Typography>
						<Button
							variant="contained"
							onClick={() => {
								globalThis.location.reload();
							}}
						>
							Reload Application
						</Button>
					</Paper>
				</Box>
			);
		}

		return this.props.children;
	}
}
