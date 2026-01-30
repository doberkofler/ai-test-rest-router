/* eslint-disable import-x/no-named-as-default */
import React, {createContext, useContext} from 'react';
import useTheme from '../hooks/use-theme';
import type {ReactNode} from 'react';

interface ThemeContextType {
	theme: 'light' | 'dark' | 'system';
	setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
	/** Children to be rendered. */
	children: ReactNode;
}

/**
 * Provides theme state and actions.
 * @param props - Component props.
 * @param props.children - Children to be rendered.
 * @returns React component.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
	const {theme, setTheme} = useTheme();

	return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
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
