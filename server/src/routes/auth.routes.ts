import {Router} from 'express';
import {LoginSchema, SHARED_CONSTANTS} from '@shared/logic';
import {configService} from '../services/config.service.ts';
import {sessionService} from '../services/session.service.ts';

const router = Router();

router.post('/login', function login(req, res) {
	try {
		const credentials = LoginSchema.parse(req.body);
		const users = configService.getUsers();

		const user = users.find((u) => u.username === credentials.username && u.password === credentials.password);
		if (user) {
			const sid = sessionService.createSession(user.username, user.fullName);

			const isProduction = process.env['NODE_ENV'] === 'production';
			res.cookie(SHARED_CONSTANTS.COOKIE_NAME, sid, {
				httpOnly: true,
				secure: isProduction,
				sameSite: isProduction ? 'strict' : 'lax',
			});

			res.json({
				username: user.username,
				fullName: user.fullName,
			});
			return;
		}

		res.status(401).json({error: 'Invalid credentials'});
	} catch {
		res.status(400).json({error: 'Bad request'});
	}
});

router.post('/logout', function logout(req, res) {
	const sid = (req.cookies as Record<string, string>)[SHARED_CONSTANTS.COOKIE_NAME];
	if (sid) {
		sessionService.deleteSession(sid);
	}
	res.clearCookie(SHARED_CONSTANTS.COOKIE_NAME);
	res.json({status: 'ok'});
});

export const authRoutes = router;
