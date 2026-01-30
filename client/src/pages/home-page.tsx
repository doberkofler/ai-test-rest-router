import React from 'react';
import {Typography, Box, Paper} from '@mui/material';

/**
 * Home page component with MUI styling.
 * @returns React component.
 */
export const HomePage: React.FC = () => {
	return (
		<Box>
			<Typography variant="h4" gutterBottom>
				Home
			</Typography>
			<Paper sx={{p: 3}}>
				<Typography variant="body1">Welcome to the SPA demonstration.</Typography>
			</Paper>
		</Box>
	);
};
