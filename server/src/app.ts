import express, {json, static as serveStatic} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile} from 'node:fs/promises';
import morgan from 'morgan';
import {authRoutes} from './routes/auth.routes.ts';
import {apiRoutes} from './routes/api.routes.ts';
import {configService} from './services/config.service.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates and configures the Express application.
 * @returns Configured express application.
 */
export async function createApp() {
	const app = express();

	// Load configuration
	await configService.loadConfig();

	// Load express version from node_modules
	let expressVersion = 'unknown';
	try {
		const expressPkgPath = path.join(__dirname, '../node_modules/express/package.json');
		const expressPkg = JSON.parse(await readFile(expressPkgPath, 'utf8')) as {version: string};
		expressVersion = expressPkg.version;
	} catch (error) {
		app.set('express_load_error', error);
	}

	app.set('START_TIMESTAMP', new Date().toISOString());
	app.set('EXPRESS_VERSION', expressVersion);

	// Middleware
	app.use(helmet({
		contentSecurityPolicy: false,
	}));
	app.use(cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}));
	app.use(json());
	app.use(cookieParser());
	
	// Structured logging with morgan
	app.use(morgan('combined'));

	// Health check
	app.get('/api/health', (_req, res) => {
		res.json({status: 'ok'});
	});

	// Routes
	app.use('/api/auth', authRoutes);
	app.use('/api', apiRoutes);

	// Static files & SPA fallback
	const clientPath = path.join(__dirname, '../../client/dist');
	app.use(serveStatic(clientPath));

	// Use named function for coverage
	app.get(/^(?!\/api).+/, function spaFallback(_req, res) {
		res.sendFile(path.join(clientPath, 'index.html'));
	});

	return app;
}
