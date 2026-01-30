import {Router} from 'express';
import type {Response} from 'express';
import {OptionsSchema} from '../shared/schemas.ts';
import {configService} from '../services/config.service.ts';
import {authGuard} from '../middleware/auth.middleware.ts';
import type {AuthRequest} from '../middleware/auth.middleware.ts';

const router = Router();

// Apply authGuard to all routes in this router
router.use(authGuard);

router.get('/info', function getInfo(req: AuthRequest, res: Response) {
	const session = req.session;
	
	if (!session) {
		res.status(401).json({error: 'No session'});
		return;
	}

	const startTimestamp = (req.app.get('START_TIMESTAMP') as string);
	const expressVersion = (req.app.get('EXPRESS_VERSION') as string);

	res.json({
		startTimestamp,
		serverTime: new Date().toISOString(),
		nodeVersion: process.version,
		expressVersion,
		user: {
			username: session.username,
			fullName: session.fullName,
			loginTimestamp: session.loginTimestamp,
		}
	});
});

router.get('/options', function getOptions(_req, res) {
	res.json(configService.getOptions());
});

router.post('/options', async function updateOptions(req, res) {
	try {
		const newOptions = OptionsSchema.parse(req.body);
		await configService.updateOptions(newOptions);
		res.json(newOptions);
	} catch {
		res.status(400).json({error: 'Bad request'});
	}
});

export const apiRoutes = router;
