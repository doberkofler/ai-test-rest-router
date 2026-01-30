import {randomUUID} from 'node:crypto';

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
