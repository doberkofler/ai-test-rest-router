import React from 'react';
import type {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {AuthProvider} from '@client/contexts/auth-provider.tsx';
import {ThemeProvider} from '@client/contexts/theme-provider.tsx';

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
