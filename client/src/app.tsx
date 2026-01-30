import {Routes, Route} from 'react-router-dom';
import {MainLayout} from '@client/layouts/main-layout.tsx';
import {HomePage} from '@client/pages/home-page.tsx';
import {AboutPage} from '@client/pages/about-page.tsx';
import {SettingsPage} from '@client/pages/settings-page.tsx';
import {LoginPage} from '@client/pages/login-page.tsx';
import {ProtectedRoute} from '@client/components/protected-route.tsx';

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
