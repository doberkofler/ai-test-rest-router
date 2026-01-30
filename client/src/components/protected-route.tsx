import React from 'react';
import {Navigate, useLocation, Outlet} from 'react-router-dom';
import {useAuth} from '../contexts/auth-context';

/**
 * Component to protect routes that require authentication.
 * @returns React component.
 */
export const ProtectedRoute: React.FC = () => {
	const {isAuthenticated} = useAuth();
	const location = useLocation();

	return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{from: location}} replace />;
};
