import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import request from 'supertest';
import {createApp} from './app.ts';
import {configService} from './services/config.service.ts';
import {sessionService} from './services/session.service.ts';
import {SHARED_CONSTANTS} from '@shared/logic';

const API_BASE = SHARED_CONSTANTS.API_BASE;
const COOKIE_NAME = SHARED_CONSTANTS.COOKIE_NAME;

describe('Modular Server API - Detailed', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it(`GET ${API_BASE}/health returns 200 and status ok`, async () => {
		const app = await createApp();
		const response = await request(app).get(`${API_BASE}/health`);
		expect(response.status).toBe(200);
		expect(response.body).toEqual({status: 'ok'});
	});

	it(`POST ${API_BASE}/auth/login with valid credentials`, async () => {
		const app = await createApp();
		const response = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'secret'});

		expect(response.status).toBe(200);
		expect(response.headers['set-cookie']).toBeDefined();
		expect((response.body as {username: string}).username).toBe('admin');
	});

	it(`POST ${API_BASE}/auth/login with invalid credentials`, async () => {
		const app = await createApp();
		const response = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'wrong'});

		expect(response.status).toBe(401);
	});

	it(`POST ${API_BASE}/auth/login handles bad payload`, async () => {
		const app = await createApp();
		const response = await request(app).post(`${API_BASE}/auth/login`).send({invalid: 'payload'});

		expect(response.status).toBe(400);
	});

	it(`GET ${API_BASE}/info requires authentication`, async () => {
		const app = await createApp();
		const response = await request(app).get(`${API_BASE}/info`);
		expect(response.status).toBe(401);
	});

	it(`GET ${API_BASE}/info handles invalid session`, async () => {
		const app = await createApp();
		const response = await request(app)
			.get(`${API_BASE}/info`)
			.set('Cookie', [`${COOKIE_NAME}=invalid-id`]);
		expect(response.status).toBe(401);
	});

	it(`GET ${API_BASE}/info with valid session`, async () => {
		const app = await createApp();
		const loginRes = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'secret'});

		const cookie = loginRes.get('Set-Cookie') ?? [];
		const response = await request(app).get(`${API_BASE}/info`).set('Cookie', cookie);

		expect(response.status).toBe(200);
		expect((response.body as {user: {username: string}}).user.username).toBe('admin');
	});

	it(`GET ${API_BASE}/info handles session timeout`, async () => {
		const app = await createApp();
		const loginRes = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'secret'});

		const cookie = loginRes.get('Set-Cookie') ?? [];

		// Advance time beyond 1 hour
		vi.advanceTimersByTime(3_600_001);

		const response = await request(app).get(`${API_BASE}/info`).set('Cookie', cookie);

		expect(response.status).toBe(401);
		expect((response.body as {error: string}).error).toBe('Session timed out');
	});

	it(`POST ${API_BASE}/options updates timeout`, async () => {
		const app = await createApp();
		const loginRes = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'secret'});

		const cookie = loginRes.get('Set-Cookie') ?? [];
		const response = await request(app).post(`${API_BASE}/options`).set('Cookie', cookie).send({sessionTimeoutMinutes: 120});

		expect(response.status).toBe(200);
		expect(response.body).toEqual({sessionTimeoutMinutes: 120});
		expect(configService.getOptions().sessionTimeoutMinutes).toBe(120);
	});

	it(`POST ${API_BASE}/options handles invalid payload`, async () => {
		const app = await createApp();
		const loginRes = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'secret'});

		const cookie = loginRes.get('Set-Cookie') ?? [];
		const response = await request(app).post(`${API_BASE}/options`).set('Cookie', cookie).send({sessionTimeoutMinutes: -1}); // Too small

		expect(response.status).toBe(400);
	});

	it(`POST ${API_BASE}/auth/logout invalidates session`, async () => {
		const app = await createApp();
		const loginRes = await request(app).post(`${API_BASE}/auth/login`).send({username: 'admin', password: 'secret'});

		const cookie = loginRes.get('Set-Cookie') ?? [];
		await request(app).post(`${API_BASE}/auth/logout`).set('Cookie', cookie);

		const response = await request(app).get(`${API_BASE}/info`).set('Cookie', cookie);
		expect(response.status).toBe(401);
	});

	it('SessionService methods', () => {
		const sid = sessionService.createSession('user', 'Name');
		expect(sessionService.getSession('invalid')).toBeUndefined();

		const initial = sessionService.getSession(sid)?.lastActive ?? 0;
		vi.advanceTimersByTime(1000);
		sessionService.updateActivity(sid);
		const updated = sessionService.getSession(sid)?.lastActive ?? 0;
		expect(updated).toBeGreaterThan(initial);

		sessionService.updateActivity('invalid');

		sessionService.deleteSession(sid);
		expect(sessionService.getSession(sid)).toBeUndefined();
	});

	it('ConfigService getters', () => {
		expect(configService.getUsers()).toBeDefined();
		expect(configService.getOptions()).toBeDefined();
	});

	it('SPA fallback route works', async () => {
		const app = await createApp();
		const response = await request(app).get('/some-spa-route');
		expect(response.status).toBe(200);
		expect(response.header['content-type']).toContain('text/html');
	});

	it('ConfigService loadConfig handles failure', async () => {
		vi.spyOn(configService, 'readLocalFile').mockRejectedValue(new Error('fail'));
		await expect(configService.loadConfig()).rejects.toThrow('fail');
	});
});
