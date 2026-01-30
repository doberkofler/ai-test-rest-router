import React, {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {OptionsSchema} from '@shared/logic';
import type {Options} from '@shared/logic';
import {useThemeContext} from '../contexts/theme-provider';
import {
	Typography,
	Box,
	Paper,
	TextField,
	Button,
	Alert,
	ToggleButtonGroup,
	ToggleButton,
	FormControl,
	FormLabel,
	CircularProgress,
	Divider,
} from '@mui/material';
import {Brightness4 as Brightness4Icon, Brightness7 as Brightness7Icon, Computer as ComputerIcon} from '@mui/icons-material';

const fetchOptions = async (): Promise<Options> => {
	const res = await fetch('http://localhost:3001/api/options', {
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to fetch options');
	const data: unknown = await res.json();
	return OptionsSchema.parse(data);
};

const updateOptions = async (newOptions: Options): Promise<Options> => {
	const res = await fetch('http://localhost:3001/api/options', {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(newOptions),
		credentials: 'include',
	});
	if (!res.ok) throw new Error('Failed to update options');
	const data: unknown = await res.json();
	return OptionsSchema.parse(data);
};

/**
 * Settings page component for modifying application preferences using MUI.
 * @returns React component.
 */
export const SettingsPage: React.FC = () => {
	const queryClient = useQueryClient();
	const {theme, setTheme} = useThemeContext();
	const {
		data: currentOptions,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['options'],
		queryFn: fetchOptions,
	});

	const [timeoutInput, setTimeoutInput] = useState<string>('');
	const [message, setMessage] = useState<{type: 'success' | 'error'; text: string} | null>(null);

	// Sync local state when options are fetched
	const [lastSyncedOptions, setLastSyncedOptions] = useState<Options | null>(null);
	if (currentOptions && currentOptions !== lastSyncedOptions) {
		setTimeoutInput(currentOptions.sessionTimeoutMinutes.toString());
		setLastSyncedOptions(currentOptions);
	}

	const mutation = useMutation({
		mutationFn: updateOptions,
		onSuccess: (data) => {
			void queryClient.setQueryData(['options'], data);
			setMessage({type: 'success', text: 'Settings updated successfully'});
		},
		onError: (error_) => {
			setMessage({type: 'error', text: error_ instanceof Error ? error_.message : 'Update failed'});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const minutes = Number.parseInt(timeoutInput, 10);
		if (!timeoutInput || Number.isNaN(minutes) || minutes < 1 || minutes > 1440) {
			setMessage({type: 'error', text: 'Timeout must be between 1 and 1440 minutes'});
			return;
		}
		mutation.mutate({sessionTimeoutMinutes: minutes});
	};

	const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newTheme: 'light' | 'dark' | 'system' | null) => {
		if (newTheme !== null) {
			setTheme(newTheme);
		}
	};

	if (isLoading)
		return (
			<Box sx={{display: 'flex', justifyContent: 'center', p: 4}}>
				<CircularProgress />
			</Box>
		);
	if (error)
		return (
			<Alert severity="error" sx={{m: 2}}>
				Error loading options
			</Alert>
		);

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Settings
			</Typography>

			{message && (
				<Alert
					severity={message.type}
					sx={{mb: 3}}
					onClose={() => {
						setMessage(null);
					}}
				>
					{message.text}
				</Alert>
			)}

			<Box sx={{display: 'flex', flexDirection: 'column', gap: 4}}>
				<Paper sx={{p: 3}}>
					<Typography variant="h6" gutterBottom>
						Appearance
					</Typography>
					<Divider sx={{mb: 3}} />
					<FormControl component="fieldset">
						<FormLabel component="legend" sx={{mb: 1}}>
							Theme Preference
						</FormLabel>
						<ToggleButtonGroup value={theme} exclusive onChange={handleThemeChange} aria-label="theme preference" color="primary">
							<ToggleButton value="light" aria-label="light theme">
								<Brightness7Icon sx={{mr: 1}} /> Light
							</ToggleButton>
							<ToggleButton value="dark" aria-label="dark theme">
								<Brightness4Icon sx={{mr: 1}} /> Dark
							</ToggleButton>
							<ToggleButton value="system" aria-label="system theme">
								<ComputerIcon sx={{mr: 1}} /> System
							</ToggleButton>
						</ToggleButtonGroup>
					</FormControl>
				</Paper>

				<Paper sx={{p: 3}}>
					<Typography variant="h6" gutterBottom>
						Server Options
					</Typography>
					<Divider sx={{mb: 3}} />
					<Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400}}>
						<TextField
							fullWidth
							label="Session Timeout (minutes)"
							id="timeout"
							value={timeoutInput}
							onChange={(e) => {
								setTimeoutInput(e.target.value);
							}}
							helperText="1h = 60 minutes. Range: 1 to 1440 minutes."
							margin="normal"
							required
						/>
						<Button type="submit" variant="contained" disabled={mutation.isPending} sx={{mt: 2}}>
							{mutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Save Settings'}
						</Button>
					</Box>
				</Paper>
			</Box>
		</Box>
	);
};
