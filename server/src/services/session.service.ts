import {randomUUID} from 'node:crypto';
import {configService} from './config.service.ts';

/**
 * Session data structure.
 */
export interface Session {
	/** Username of the logged in user. */
	username: string;
	/** Full name of the user. */
	fullName: string;
	/** When the user logged in. */
	loginTimestamp: string;
	/** Timestamp of last activity for timeout calculation. */
	lastActive: number;
}

/**
 * Service for managing user sessions.
 */
class SessionService {
	private sessions = new Map<string, Session>();
	private cleanupInterval: NodeJS.Timeout | null = null;

	/**
	 * Starts the background cleanup task.
	 */
	startCleanupTask() {
		if (this.cleanupInterval) return;

		// Run cleanup every minute
		this.cleanupInterval = setInterval(() => {
			this.cleanup();
		}, 60_000);
	}

	/**
	 * Stops the background cleanup task.
	 */
	stopCleanupTask() {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
			this.cleanupInterval = null;
		}
	}

	/**
	 * Performs cleanup of expired sessions.
	 */
	private cleanup() {
		const now = Date.now();
		const timeoutMinutes = configService.getOptions().sessionTimeoutMinutes;
		const timeoutMs = timeoutMinutes * 60 * 1000;

		for (const [sid, session] of this.sessions.entries()) {
			if (now - session.lastActive > timeoutMs) {
				this.sessions.delete(sid);
			}
		}
	}

	/**
	 * Creates a new session.
	 * @param username - Username.
	 * @param fullName - Full name.
	 * @returns Session ID.
	 */
	createSession(username: string, fullName: string): string {
		const sid = randomUUID();
		this.sessions.set(sid, {
			username,
			fullName,
			loginTimestamp: new Date().toISOString(),
			lastActive: Date.now(),
		});
		return sid;
	}

	/**
	 * Retrieves a session by ID.
	 * @param sid - Session ID.
	 * @returns Session data or undefined.
	 */
	getSession(sid: string): Session | undefined {
		const session = this.sessions.get(sid);
		if (session) {
			return session;
		}
		// explicitly return undefined
		return undefined;
	}

	/**
	 * Updates the last active timestamp of a session.
	 * @param sid - Session ID.
	 */
	updateActivity(sid: string) {
		const session = this.sessions.get(sid);
		if (session) {
			session.lastActive = Date.now();
		}
	}

	/**
	 * Deletes a session.
	 * @param sid - Session ID.
	 */
	deleteSession(sid: string) {
		this.sessions.delete(sid);
	}
}

export const sessionService = new SessionService();
export default sessionService;
