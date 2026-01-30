import {createApp} from './app.ts';
import {configService} from './services/config.service.ts';

const port = 3001;

try {
	const app = await createApp();
	const options = configService.getOptions();
	
	app.listen(port, () => {
		console.info(`Server running at http://localhost:${String(port)}`);
		console.info(`Session timeout: ${String(options.sessionTimeoutMinutes)} minutes`);
	});
} catch (error: unknown) {
	console.error('Failed to start server:', error);
	throw error;
}

