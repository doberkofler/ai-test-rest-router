import React from 'react';
import type {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '../contexts/auth-provider';
import {ThemeProvider} from '../contexts/theme-provider';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

export const TestWrapper: React.FC<{children: ReactNode}> = ({children}) => {
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>{children}</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
};
