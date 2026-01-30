import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './index.css';
import App from '@client/app.tsx';
import {AuthProvider} from '@client/contexts/auth-provider.tsx';
import {ThemeProvider} from '@client/contexts/theme-provider.tsx';
import {BrowserRouter} from 'react-router-dom';
import {ErrorBoundary} from '@client/components/error-boundary.tsx';

const queryClient = new QueryClient();

const container = document.querySelector('#root');
if (container) {
	createRoot(container).render(
		<StrictMode>
			<ErrorBoundary>
				<ThemeProvider>
					<QueryClientProvider client={queryClient}>
						<AuthProvider>
							<BrowserRouter>
								<App />
							</BrowserRouter>
						</AuthProvider>
					</QueryClientProvider>
				</ThemeProvider>
			</ErrorBoundary>
		</StrictMode>,
	);
}
