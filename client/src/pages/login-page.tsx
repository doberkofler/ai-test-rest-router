import React, {useState} from 'react';
import {useAuth} from '../contexts/auth-context';
import {useThemeContext} from '../contexts/theme-provider';
import {useNavigate, useLocation} from 'react-router-dom';

interface LoginData {
	username: string;
	fullName: string;
}

/**
 * Login page component.
 * @returns React component.
 */
export const LoginPage: React.FC = () => {
	const [username, setUsername] = useState('admin');
	const [password, setPassword] = useState('secret');
	const [error, setError] = useState<string | null>(null);
	const {login} = useAuth();
	const {theme, setTheme} = useThemeContext();
	const navigate = useNavigate();
	const location = useLocation();

	const state = location.state as {from?: {pathname: string}} | null;
	const from = state?.from?.pathname ?? '/';

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		setError(null);

		fetch('http://localhost:3001/api/auth/login', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({username, password}),
			credentials: 'include',
		})
			.then(async (res) => {
				if (res.ok) {
					return res.json() as Promise<LoginData>;
				}
				const data = await res.json() as {error?: string};
				throw new Error(data.error ?? 'Login failed');
			})
			.then((user) => {
				login(user);
				navigate(from, {replace: true});
			})
			.catch((error_: unknown) => {
				if (error_ instanceof Error) {
					setError(error_.message);
				} else {
					setError('Unknown error');
				}
			});
	};

	const toggleTheme = () => {
		const nextTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(nextTheme);
	};

	const themeIcon = theme === 'dark' ? '☀️' : '🌙';

	// Theme-aware styles
	const isDark = theme === 'dark';
	const containerBg = isDark ? '#242424' : '#ffffff';
	const containerBorder = isDark ? '#333' : '#ddd';
	const inputBg = isDark ? '#333333' : '#f5f5f5';
	const inputBorder = isDark ? '#444' : '#ccc';
	const inputColor = isDark ? '#fff' : '#000';
	const labelColor = isDark ? '#fff' : '#213547';
	const errorColor = '#ff6b6b';
	const buttonBg = '#646cff';
	const themeButtonBg = isDark ? '#444' : '#e0e0e0';
	const themeButtonColor = isDark ? '#fff' : '#000';

	return (
		<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: isDark ? '#1a1a1a' : '#ffffff'}}>
			<button 
				onClick={toggleTheme}
				title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
				style={{position: 'absolute', top: '1rem', right: '1rem', padding: '0.5rem 1rem', background: themeButtonBg, color: themeButtonColor, border: `1px solid ${inputBorder}`, borderRadius: '4px', cursor: 'pointer', fontSize: '1.2rem'}}
			>
				{themeIcon}
			</button>
			<form onSubmit={handleSubmit} style={{padding: '2rem', border: `1px solid ${containerBorder}`, borderRadius: '8px', background: containerBg, minWidth: '300px', boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.1)'}}>
				<h2 style={{color: labelColor, marginBottom: '1.5rem', textAlign: 'center'}}>Login</h2>
				{error ? <p style={{color: errorColor, marginBottom: '1rem', textAlign: 'center'}}>{error}</p> : null}
				<div style={{marginBottom: '1rem'}}>
					<label htmlFor="username" style={{display: 'block', color: labelColor, marginBottom: '0.5rem', fontWeight: '500'}}>Username</label>
					<input
						id="username"
						type="text"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						style={{width: '100%', padding: '0.75rem', background: inputBg, color: inputColor, border: `1px solid ${inputBorder}`, borderRadius: '4px', boxSizing: 'border-box', fontSize: '1rem'}}
					/>
				</div>
				<div style={{marginBottom: '1.5rem'}}>
					<label htmlFor="password" style={{display: 'block', color: labelColor, marginBottom: '0.5rem', fontWeight: '500'}}>Password</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						style={{width: '100%', padding: '0.75rem', background: inputBg, color: inputColor, border: `1px solid ${inputBorder}`, borderRadius: '4px', boxSizing: 'border-box', fontSize: '1rem'}}
					/>
				</div>
				<button type="submit" style={{width: '100%', padding: '0.75rem', background: buttonBg, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', transition: 'background-color 0.2s'}}>
					Sign In
				</button>
			</form>
		</div>
	);
};
