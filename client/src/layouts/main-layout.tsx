import React, {useState} from 'react';
import {NavLink, Outlet, useNavigate, useLocation} from 'react-router-dom';
import {
	Box,
	Drawer,
	AppBar,
	Toolbar,
	List,
	Typography,
	Divider,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Tooltip,
} from '@mui/material';
import {
	Menu as MenuIcon,
	ChevronLeft as ChevronLeftIcon,
	Home as HomeIcon,
	Info as InfoIcon,
	Settings as SettingsIcon,
	Logout as LogoutIcon,
	Brightness4 as Brightness4Icon,
	Brightness7 as Brightness7Icon,
} from '@mui/icons-material';
import {useAuth} from '@client/contexts/auth-context.ts';
import {useThemeContext} from '@client/contexts/theme-provider.tsx';
import {apiClient} from '@client/services/api-client.ts';

const drawerWidth = '240px';

/**
 * Main application layout with MUI sidebar navigation and logout.
 * @returns React component.
 */
export const MainLayout: React.FC = () => {
	const {logout} = useAuth();
	const {theme, setTheme} = useThemeContext();
	const navigate = useNavigate();
	const location = useLocation();
	const [open, setOpen] = useState(true);

	const handleLogout = () => {
		apiClient
			.post('/auth/logout')
			.then(() => {
				logout();
				navigate('/login');
			})
			.catch((error: unknown) => {
				console.error('Logout failed', error);
				logout();
				navigate('/login');
			});
	};

	const toggleTheme = () => {
		const nextTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(nextTheme);
	};

	const toggleDrawer = () => {
		setOpen(!open);
	};

	const menuItems = [
		{text: 'Home', icon: <HomeIcon />, path: '/'},
		{text: 'About', icon: <InfoIcon />, path: '/about'},
		{text: 'Settings', icon: <SettingsIcon />, path: '/settings'},
	];

	const getPageTitle = () => {
		const current = menuItems.find((item) => item.path === location.pathname);
		return current?.text ?? 'App';
	};

	return (
		<Box sx={{display: 'flex'}}>
			<AppBar
				position="fixed"
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					transition: (theme) =>
						theme.transitions.create(['width', 'margin'], {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.leavingScreen,
						}),
					...(open && {
						marginLeft: drawerWidth,
						width: `calc(100% - ${drawerWidth})`,
						transition: (theme) =>
							theme.transitions.create(['width', 'margin'], {
								easing: theme.transitions.easing.sharp,
								duration: theme.transitions.duration.enteringScreen,
							}),
					}),
				}}
			>
				<Toolbar variant="dense">
					<IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer} edge="start" sx={{marginRight: 2}}>
						{open ? <ChevronLeftIcon /> : <MenuIcon />}
					</IconButton>
					<Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
						{getPageTitle()}
					</Typography>
					<Tooltip title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
						<IconButton color="inherit" onClick={toggleTheme}>
							{theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
						</IconButton>
					</Tooltip>
					<Tooltip title="Logout">
						<IconButton color="inherit" onClick={handleLogout}>
							<LogoutIcon />
						</IconButton>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				open={open}
				sx={{
					width: open ? drawerWidth : (theme) => theme.spacing(14),
					flexShrink: 0,
					whiteSpace: 'nowrap',
					boxSizing: 'border-box',
					'& .MuiDrawer-paper': {
						width: open ? drawerWidth : (theme) => theme.spacing(14),
						transition: (theme) =>
							theme.transitions.create('width', {
								easing: theme.transitions.easing.sharp,
								duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
							}),
						overflowX: 'hidden',
					},
				}}
			>
				<Toolbar variant="dense" />
				<Box sx={{overflow: 'auto'}}>
					<List>
						{menuItems.map((item) => (
							<ListItem key={item.text} disablePadding sx={{display: 'block'}}>
								<ListItemButton
									component={NavLink}
									to={item.path}
									sx={{
										minHeight: 48,
										justifyContent: open ? 'initial' : 'center',
										px: 2.5,
										'&.active': {
											bgcolor: 'action.selected',
											'& .MuiListItemIcon-root': {
												color: 'primary.main',
											},
											'& .MuiListItemText-primary': {
												color: 'primary.main',
												fontWeight: 'bold',
											},
										},
									}}
								>
									<ListItemIcon
										sx={{
											minWidth: 0,
											mr: open ? 3 : 'auto',
											justifyContent: 'center',
										}}
									>
										{item.icon}
									</ListItemIcon>
									<ListItemText primary={item.text} sx={{opacity: open ? 1 : 0}} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
					<Divider />
				</Box>
			</Drawer>
			<Box component="main" sx={{flexGrow: 1, p: 3}}>
				<Toolbar variant="dense" />
				<Outlet />
			</Box>
		</Box>
	);
};
