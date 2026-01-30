import React from 'react';
import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/auth-context';
import {useThemeContext} from '../contexts/theme-provider';

/**
 * Main application layout with sidebar navigation and logout.
 * @returns React component.
 */
export const MainLayout: React.FC = () => {
	const {logout} = useAuth();
	const {theme, setTheme} = useThemeContext();
	const navigate = useNavigate();

	const handleLogout = () => {
		fetch('http://localhost:3001/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		})
			.then(() => {
				logout();
				navigate('/login');
			})
			.catch((error: unknown) => {
				console.error('Logout failed', error);
				logout(); // Clear local even if server fails
				navigate('/login');
			});
	};

	const toggleTheme = () => {
		const nextTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(nextTheme);
	};

	const themeIcon = theme === 'dark' ? '☀️' : '🌙';

	return (
		<div className="layout-container">
			<aside className="sidebar" style={{display: 'flex', flexDirection: 'column'}}>
				<nav style={{flex: 1}}>
					<ul>
						<li>
							<NavLink to="/" className={({isActive}) => (isActive ? 'active' : '')}>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink to="/about" className={({isActive}) => (isActive ? 'active' : '')}>
								About
							</NavLink>
						</li>
						<li>
							<NavLink to="/settings" className={({isActive}) => (isActive ? 'active' : '')}>
								Settings
							</NavLink>
						</li>
					</ul>
				</nav>
				<div style={{display: 'flex', gap: '0.5rem', marginTop: 'auto'}}>
					<button
						onClick={toggleTheme}
						title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
						style={{
							flex: 1,
							padding: '0.75rem',
							background: '#646cff',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
							fontSize: '1rem',
						}}
					>
						{themeIcon}
					</button>
					<button
						onClick={handleLogout}
						style={{flex: 1, padding: '0.75rem', background: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
					>
						Logout
					</button>
				</div>
			</aside>
			<main className="content">
				<Outlet />
			</main>
		</div>
	);
};
