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
import {sessionService} from './services/session.service.ts';
import {SHARED_CONSTANTS} from '@shared/logic';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates and configures the Express application.
 * @returns Configured express application.
 */
export async function createApp() {
	const app = express();

	// Load configuration
	await configService.loadConfig();

	// Start session cleanup
	sessionService.startCleanupTask();

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
	app.use(
		helmet({
			contentSecurityPolicy: false,
		}),
	);

	// Generalize CORS for development
	const allowedOrigins = new Set(['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173', 'http://127.0.0.1:4173']);

	app.use(
		cors({
			origin: (origin, callback) => {
				// Allow requests with no origin (like mobile apps or curl)
				if (!origin) {
					callback(null, true);
					return;
				}

				if (allowedOrigins.has(origin)) {
					callback(null, true);
				} else {
					console.warn(`CORS blocked request from origin: ${origin}`);
					callback(new Error('Not allowed by CORS'));
				}
			},
			credentials: true,
		}),
	);
	app.use(json());
	app.use(cookieParser());

	// Structured logging with morgan
	app.use(morgan('combined'));

	// Health check
	app.get(`${SHARED_CONSTANTS.API_BASE}/health`, (_req, res) => {
		res.json({status: 'ok'});
	});

	// Routes
	app.use(`${SHARED_CONSTANTS.API_BASE}/auth`, authRoutes);
	app.use(SHARED_CONSTANTS.API_BASE, apiRoutes);

	// Static files & SPA fallback
	const clientPath = path.join(__dirname, '../../client/dist');
	app.use(serveStatic(clientPath));

	// Use named function for coverage
	const spaExclude = new RegExp(`^(?!${SHARED_CONSTANTS.API_BASE}).+`);
	app.get(spaExclude, function spaFallback(_req, res) {
		res.sendFile(path.join(clientPath, 'index.html'));
	});

	// Centralized error handler
	app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		console.error(err);
		const message = err instanceof Error ? err.message : 'Internal Server Error';
		res.status(500).json({error: message});
	});

	return app;
}
