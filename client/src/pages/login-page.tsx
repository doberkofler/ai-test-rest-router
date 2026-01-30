import React, {useState} from 'react';
import {useAuth} from '../contexts/auth-context';
import {useThemeContext} from '../contexts/theme-provider';
import {useNavigate, useLocation} from 'react-router-dom';
import {Box, Button, Card, CardContent, TextField, Typography, Alert, IconButton, Tooltip} from '@mui/material';
import {Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon} from '@mui/icons-material';
import {z} from 'zod';

const LoginResponseSchema = z.object({
	username: z.string(),
	fullName: z.string(),
});

const ErrorResponseSchema = z.object({
	error: z.string().optional(),
});

/**
 * Login page component with MUI styling.
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

	// WHY: useLocation().state is typed as any; narrowing to expected structure for redirect logic.
	const state = location.state as {from?: {pathname: string}} | null;
	const from = state?.from?.pathname ?? '/';

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		fetch('http://localhost:3001/api/auth/login', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({username, password}),
			credentials: 'include',
		})
			.then(async (res) => {
				const json: unknown = await res.json();
				if (res.ok) {
					return LoginResponseSchema.parse(json);
				}
				const data = ErrorResponseSchema.parse(json);
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

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100vh',
				bgcolor: 'background.default',
			}}
		>
			<Tooltip title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
				<IconButton onClick={toggleTheme} sx={{position: 'absolute', top: 8, right: 8}} color="inherit">
					{theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
				</IconButton>
			</Tooltip>
			<Card component="form" onSubmit={handleSubmit} sx={{minWidth: 320, p: 2}}>
				<CardContent>
					<Typography variant="h5" component="h2" gutterBottom align="center">
						Login
					</Typography>
					{error && (
						<Alert severity="error" sx={{mb: 2}}>
							{error}
						</Alert>
					)}
					<TextField
						fullWidth
						label="Username"
						id="username"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value);
						}}
						margin="normal"
						required
					/>
					<TextField
						fullWidth
						label="Password"
						id="password"
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
						}}
						margin="normal"
						required
					/>
					<Button type="submit" fullWidth variant="contained" sx={{mt: 3}}>
						Sign In
					</Button>
				</CardContent>
			</Card>
		</Box>
	);
};
