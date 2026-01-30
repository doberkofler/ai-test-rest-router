import React, {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {OptionsSchema} from '@shared/schemas';
import type {Options} from '@shared/schemas';
import {useTheme} from '../hooks/use-theme';

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
 * Settings page component for modifying application preferences.
 * @returns React component.
 */
export const SettingsPage: React.FC = () => {
	const queryClient = useQueryClient();
	const {theme, setTheme} = useTheme();
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

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();
		const minutes = Number.parseInt(timeoutInput, 10);
		if (Number.isNaN(minutes) || minutes < 1 || minutes > 1440) {
			setMessage({type: 'error', text: 'Timeout must be between 1 and 1440 minutes'});
			return;
		}
		mutation.mutate({sessionTimeoutMinutes: minutes});
	};

	if (isLoading) return <p>Loading options...</p>;
	if (error) return <p style={{color: 'red'}}>Error loading options</p>;

	return (
		<div>
			<h1>Settings</h1>
			{message && <p style={{color: message.type === 'success' ? '#48bb78' : '#f56565'}}>{message.text}</p>}

			<section style={{marginBottom: '2rem', padding: '1rem', border: '1px solid #444', borderRadius: '8px'}}>
				<h2>Theme</h2>
				<div style={{display: 'flex', gap: '1rem'}}>
					<button
						onClick={() => {
							setTheme('light');
						}}
						style={{
							padding: '0.5rem 1rem',
							background: theme === 'light' ? '#646cff' : '#333',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Light
					</button>
					<button
						onClick={() => {
							setTheme('dark');
						}}
						style={{
							padding: '0.5rem 1rem',
							background: theme === 'dark' ? '#646cff' : '#333',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Dark
					</button>
					<button
						onClick={() => {
							setTheme('system');
						}}
						style={{
							padding: '0.5rem 1rem',
							background: theme === 'system' ? '#646cff' : '#333',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						System Default
					</button>
				</div>
			</section>

			<section style={{padding: '1rem', border: '1px solid #444', borderRadius: '8px'}}>
				<h2>Server Options</h2>
				<form onSubmit={handleSubmit} style={{maxWidth: '400px'}}>
					<div style={{marginBottom: '1.5rem'}}>
						<label htmlFor="timeout" style={{display: 'block', marginBottom: '0.5rem'}}>
							Session Timeout (minutes)
						</label>
						<input
							id="timeout"
							type="number"
							value={timeoutInput}
							onChange={(e) => {
								setTimeoutInput(e.target.value);
							}}
							style={{width: '100%', padding: '0.5rem', background: '#1a1a1a', color: '#fff', border: '1px solid #444', borderRadius: '4px'}}
						/>
						<small style={{color: '#888'}}>1h = 60 minutes. Range: 1 to 1440 minutes.</small>
					</div>
					<button
						type="submit"
						disabled={mutation.isPending}
						style={{
							padding: '0.75rem 1.5rem',
							background: '#646cff',
							color: '#fff',
							border: 'none',
							borderRadius: '4px',
							cursor: mutation.isPending ? 'not-allowed' : 'pointer',
						}}
					>
						{mutation.isPending ? 'Saving...' : 'Save Settings'}
					</button>
				</form>
			</section>
		</div>
	);
};
