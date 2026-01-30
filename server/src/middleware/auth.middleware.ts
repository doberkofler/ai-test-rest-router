import type {Request, Response, NextFunction} from 'express';
import {sessionService} from '../services/session.service.ts';
import type {Session} from '../services/session.service.ts';
import {configService} from '../services/config.service.ts';
import {SHARED_CONSTANTS} from '@shared/logic';

/**
 * Authenticated request type.
 */
export type AuthRequest = Request & {
	/** Session data. */
	session?: Session;
	/** Session ID. */
	sid?: string;
};

/**
 * Validates the session cookie and updates last active timestamp.
 * @param req - Request.
 * @param res - Response.
 * @param next - Next function.
 */
export const authGuard = (req: Request, res: Response, next: NextFunction) => {
	const sid = (req.cookies as Record<string, string>)[SHARED_CONSTANTS.COOKIE_NAME];
	if (!sid) {
		res.status(401).json({error: 'Unauthorized'});
		return;
	}

	const session = sessionService.getSession(sid);
	if (!session) {
		res.status(401).json({error: 'Invalid session'});
		return;
	}

	const now = Date.now();
	const options = configService.getOptions();
	const sessionTimeoutMs = options.sessionTimeoutMinutes * 60 * 1000;
	if (now - session.lastActive > sessionTimeoutMs) {
		sessionService.deleteSession(sid);
		res.clearCookie(SHARED_CONSTANTS.COOKIE_NAME);
		res.status(401).json({error: 'Session timed out'});
		return;
	}

	sessionService.updateActivity(sid);
	// WHY: Express Request doesn't include custom session/sid properties; narrowing to AuthRequest.
	const authReq = req as AuthRequest;
	authReq.session = session;
	authReq.sid = sid;
	next();
};
