import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import './index.css';
import App from './app.tsx';
import {AuthProvider} from './contexts/auth-provider';
import {ThemeProvider} from './contexts/theme-provider';
import {BrowserRouter} from 'react-router-dom';
import {ErrorBoundary} from './components/error-boundary';

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
