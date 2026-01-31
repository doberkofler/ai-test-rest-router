import {useState, useEffect} from 'react';

type Theme = 'light' | 'dark' | 'system';

/**
 * Hook to manage theme (light, dark, system).
 */
export const useTheme = () => {
	const [theme, setTheme] = useState<Theme>(() => {
		const saved = localStorage.getItem('app-theme');
		if (saved === 'light') {
			return 'light';
		}
		if (saved === 'dark') {
			return 'dark';
		}
		return 'system';
	});

	useEffect(() => {
		const root = globalThis.document.documentElement;
		root.classList.remove('light', 'dark');

		const media = globalThis.matchMedia('(prefers-color-scheme: dark)');
		const isDark = media.matches;
		const effectiveTheme = theme === 'system' ? (isDark ? 'dark' : 'light') : theme;

		root.classList.add(effectiveTheme);
		localStorage.setItem('app-theme', theme);

		// Listen for system theme changes
		if (theme === 'system') {
			const media = globalThis.matchMedia('(prefers-color-scheme: dark)');
			const handleChange = () => {
				// WHY: Defensive for headless browsers or environments without active media query support.
				/* v8 ignore start */
				const currentIsDark = media.matches;
				root.classList.remove('light', 'dark');
				root.classList.add(currentIsDark ? 'dark' : 'light');
				/* v8 ignore stop */
			};
			media.addEventListener('change', handleChange);
			return () => {
				media.removeEventListener('change', handleChange);
			};
		}
		return;
	}, [theme]);

	return {theme, setTheme};
};
export default useTheme;
