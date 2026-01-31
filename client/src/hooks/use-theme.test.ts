import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useTheme} from './use-theme.ts';

describe('useTheme', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.restoreAllMocks();
		document.documentElement.className = '';
	});

	it('should default to system theme', () => {
		const {result} = renderHook(() => useTheme());
		expect(result.current.theme).toBe('system');
	});

	it('should load saved theme from localStorage', () => {
		localStorage.setItem('app-theme', 'dark');
		const {result} = renderHook(() => useTheme());
		expect(result.current.theme).toBe('dark');
	});

	it('should change theme and save to localStorage', () => {
		const {result} = renderHook(() => useTheme());

		act(() => {
			result.current.setTheme('light');
		});

		expect(result.current.theme).toBe('light');
		expect(localStorage.getItem('app-theme')).toBe('light');
		expect(document.documentElement.classList.contains('light')).toBe(true);
	});

	it('should handle system theme detection', () => {
		// Mock matchMedia
		Object.defineProperty(globalThis, 'matchMedia', {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: true, // system is dark
				media: query,
				onchange: null,
				addEventListener: vi.fn(),
				removeEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
			})),
		});

		const {result} = renderHook(() => useTheme());
		expect(result.current.theme).toBe('system');
		expect(document.documentElement.classList.contains('dark')).toBe(true);
	});

	it('should handle logic when theme remains system', () => {
		const {result} = renderHook(() => useTheme());
		expect(result.current.theme).toBe('system');
	});
});
