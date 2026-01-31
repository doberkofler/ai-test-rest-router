import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import {sessionService} from './session.service.ts';
import {configService} from './config.service.ts';

describe('SessionService', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		sessionService.stopCleanupTask();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it('should create and retrieve a session', () => {
		const sid = sessionService.createSession('user1', 'User One');
		expect(sid).toBeDefined();
		const session = sessionService.getSession(sid);
		expect(session?.username).toBe('user1');
		expect(session?.fullName).toBe('User One');
	});

	it('should return undefined for invalid session', () => {
		expect(sessionService.getSession('invalid')).toBeUndefined();
	});

	it('should update session activity', () => {
		const sid = sessionService.createSession('user1', 'User One');
		const initialLastActive = sessionService.getSession(sid)?.lastActive ?? 0;

		vi.advanceTimersByTime(1000);
		sessionService.updateActivity(sid);

		const updatedLastActive = sessionService.getSession(sid)?.lastActive ?? 0;
		expect(updatedLastActive).toBeGreaterThan(initialLastActive);
	});

	it('should delete a session', () => {
		const sid = sessionService.createSession('user1', 'User One');
		sessionService.deleteSession(sid);
		expect(sessionService.getSession(sid)).toBeUndefined();
	});

	it('should cleanup expired sessions', () => {
		const sid = sessionService.createSession('user1', 'User One');

		// Mock config timeout
		vi.spyOn(configService, 'getOptions').mockReturnValue({
			sessionTimeoutMinutes: 1,
		});

		// Move time forward by 2 minutes
		vi.advanceTimersByTime(2 * 60 * 1000 + 1000);
		sessionService.cleanup();

		expect(sessionService.getSession(sid)).toBeUndefined();
	});

	it('should not cleanup non-expired sessions', () => {
		const sid = sessionService.createSession('user1', 'User One');

		vi.spyOn(configService, 'getOptions').mockReturnValue({
			sessionTimeoutMinutes: 60,
		});

		vi.advanceTimersByTime(30 * 60 * 1000);
		sessionService.cleanup();

		expect(sessionService.getSession(sid)).toBeDefined();
	});

	it('should manage cleanup task interval', () => {
		const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
		const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');

		sessionService.startCleanupTask();
		expect(setIntervalSpy).toHaveBeenCalled();

		sessionService.startCleanupTask(); // Should not start again
		expect(setIntervalSpy).toHaveBeenCalledTimes(1);

		sessionService.stopCleanupTask();
		expect(clearIntervalSpy).toHaveBeenCalled();
	});
});
