import React, {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {AuthContext} from './auth-context';
import {UserSchema} from '../shared/schemas';
import type {UserState} from './auth-context';

const UserStateSchema = UserSchema.nullable();

interface AuthProviderProps {
	/** Children to be rendered. */
	children: React.ReactNode;
}

/**
 * Provides authentication state and actions.
 * @param props - Component props.
 * @param props.children - Children to be rendered.
 * @returns React component.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
	const [user, setUser] = useState<UserState>(() => {
		const saved = localStorage.getItem('auth_user');
		if (saved) {
			try {
				const parsed = UserStateSchema.parse(JSON.parse(saved));
				return parsed;
			} catch {
				// handled by null
			}
		}
		return null;
	});

	const queryClient = useQueryClient();

	const login = (userData: UserState) => {
		setUser(userData);
		localStorage.setItem('auth_user', JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('auth_user');
		queryClient.clear();
	};

	const isAuthenticated = user !== null;

	return <AuthContext.Provider value={{user, isAuthenticated, login, logout}}>{children}</AuthContext.Provider>;
};
