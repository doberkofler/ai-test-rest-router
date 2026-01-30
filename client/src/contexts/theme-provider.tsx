import React, {createContext, useContext, useMemo} from 'react';
import {ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, useMediaQuery} from '@mui/material';
import {useTheme} from '@client/hooks/use-theme.ts';
import type {ReactNode} from 'react';

type ThemeContextType = {
	theme: 'light' | 'dark' | 'system';
	setTheme: (theme: 'light' | 'dark' | 'system') => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
	/** Children to be rendered. */
	children: ReactNode;
};

/**
 * Provides theme state and actions with MUI integration.
 * @param props - Component props.
 * @param props.children - Children to be rendered.
 * @returns React component.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
	const {theme, setTheme} = useTheme();
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const muiTheme = useMemo(() => {
		const mode = theme === 'system' ? (prefersDarkMode ? 'dark' : 'light') : theme;
		return createTheme({
			palette: {
				mode,
			},
			// Compact density settings
			spacing: 4,
			components: {
				MuiButton: {
					defaultProps: {
						size: 'small',
					},
				},
				MuiTextField: {
					defaultProps: {
						size: 'small',
					},
				},
				MuiFormControl: {
					defaultProps: {
						size: 'small',
					},
				},
				MuiList: {
					defaultProps: {
						dense: true,
					},
				},
				MuiTable: {
					defaultProps: {
						size: 'small',
					},
				},
			},
		});
	}, [theme, prefersDarkMode]);

	return (
		<ThemeContext.Provider value={{theme, setTheme}}>
			<MuiThemeProvider theme={muiTheme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	);
};

/**
 * Hook to access the current theme context.
 * @returns The theme context.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useThemeContext = () => {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error('useThemeContext must be used within a ThemeProvider');
	}
	return context;
};
