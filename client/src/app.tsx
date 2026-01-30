import {Routes, Route} from 'react-router-dom';
import {MainLayout} from './layouts/main-layout';
import {HomePage} from './pages/home-page';
import {AboutPage} from './pages/about-page';
import {SettingsPage} from './pages/settings-page';
import {LoginPage} from './pages/login-page';
import {ProtectedRoute} from './components/protected-route';

/**
 * Root application content component.
 * @returns React component.
 */
export function AppContent() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<HomePage />} />
					<Route path="about" element={<AboutPage />} />
					<Route path="settings" element={<SettingsPage />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default AppContent;
