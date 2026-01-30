import {createContext, useContext} from 'react';

export type UserStateData = {
	username: string;
	fullName: string;
};

export type UserState = UserStateData | null;

export type AuthContextType = {
	user: UserState;
	isAuthenticated: boolean;
	login: (user: UserState) => void;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to access the current authentication context.
 * @returns The authentication context.
 */
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
