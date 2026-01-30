import React, {useEffect, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {ServerInfoSchema} from '@shared/schemas';
import type {ServerInfo} from '@shared/schemas';
import {Typography, Box, Paper, List, ListItem, ListItemText, Divider, Alert, CircularProgress} from '@mui/material';

/**
 * Fetches server information and validates with Zod.
 */
const fetchServerInfo = async (): Promise<ServerInfo> => {
	const res = await fetch('http://localhost:3001/api/info', {
		credentials: 'include',
	});
	if (res.ok) {
		const data: unknown = await res.json();
		return ServerInfoSchema.parse(data);
	}
	throw new Error(`HTTP error! status: ${res.status.toString()}`);
};

/**
 * About page component displaying system and version information using MUI.
 * @returns React component.
 */
export const AboutPage: React.FC = () => {
	const [clientTime, setClientTime] = useState(new Date().toISOString());

	const {
		data: serverInfo,
		error,
		isLoading,
	} = useQuery({
		queryKey: ['serverInfo'],
		queryFn: fetchServerInfo,
		refetchInterval: 5000,
	});

	useEffect(() => {
		const timer = setInterval(() => {
			setClientTime(new Date().toISOString());
		}, 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				About
			</Typography>

			{error instanceof Error && (
				<Alert severity="error" sx={{mb: 3}}>
					{error.message}
				</Alert>
			)}

			<Box sx={{display: 'flex', flexWrap: 'wrap', gap: 3}}>
				<Paper sx={{p: 2, flex: '1 1 300px'}}>
					<Typography variant="h6" gutterBottom>
						Client Information
					</Typography>
					<Divider />
					<List dense>
						<ListItem>
							<ListItemText primary="Build Timestamp" secondary={__BUILD_TIMESTAMP__} />
						</ListItem>
						<ListItem>
							<ListItemText primary="Current Time" secondary={clientTime} />
						</ListItem>
						<ListItem>
							<ListItemText primary="React Version" secondary={React.version} />
						</ListItem>
					</List>
				</Paper>

				<Paper sx={{p: 2, flex: '1 1 300px'}}>
					<Typography variant="h6" gutterBottom>
						Server Information
					</Typography>
					<Divider />
					{isLoading ? (
						<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
							<CircularProgress size={24} />
						</Box>
					) : (
						serverInfo && (
							<List dense>
								<ListItem>
									<ListItemText primary="Start Timestamp" secondary={serverInfo.startTimestamp} />
								</ListItem>
								<ListItem>
									<ListItemText primary="Current Time" secondary={serverInfo.serverTime} />
								</ListItem>
								<ListItem>
									<ListItemText primary="Node Version" secondary={serverInfo.nodeVersion} />
								</ListItem>
								<ListItem>
									<ListItemText primary="Express Version" secondary={serverInfo.expressVersion} />
								</ListItem>
							</List>
						)
					)}
				</Paper>

				<Paper sx={{p: 2, flex: '1 1 300px'}}>
					<Typography variant="h6" gutterBottom>
						Session Information
					</Typography>
					<Divider />
					{isLoading ? (
						<Box sx={{display: 'flex', justifyContent: 'center', p: 2}}>
							<CircularProgress size={24} />
						</Box>
					) : (
						serverInfo?.user && (
							<List dense>
								<ListItem>
									<ListItemText primary="User Code" secondary={serverInfo.user.username} />
								</ListItem>
								<ListItem>
									<ListItemText primary="Full Name" secondary={serverInfo.user.fullName} />
								</ListItem>
								<ListItem>
									<ListItemText primary="Session Created" secondary={new Date(serverInfo.user.loginTimestamp).toLocaleString()} />
								</ListItem>
							</List>
						)
					)}
				</Paper>
			</Box>
		</Box>
	);
};
