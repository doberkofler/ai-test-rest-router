import {describe, it, expect, vi} from 'vitest';
import request from 'supertest';
import {createApp} from './app.ts';

describe('App Error Handling', () => {
	it('should handle 404 for unknown API routes', async () => {
		const app = await createApp();

		// Authenticate first
		const loginRes = await request(app).post('/api/auth/login').send({username: 'admin', password: 'secret'});
		const cookie = loginRes.get('Set-Cookie');

		const res = await request(app)
			.get('/api/unknown')
			.set('Cookie', cookie ?? []);

		expect(res.status).toBe(404);
		expect(res.body).toEqual({error: 'Not found'});
	});

	it('should handle internal server errors with non-Error objects', async () => {
		const app = await createApp();
		const loginRes = await request(app).post('/api/auth/login').send({username: 'admin', password: 'secret'});
		const cookie = loginRes.get('Set-Cookie');

		const {configService} = await import('./services/config.service.ts');
		vi.spyOn(configService, 'getOptions').mockImplementation(() => {
			// eslint-disable-next-line @typescript-eslint/only-throw-error
			throw {message: 'Unknown object error'};
		});

		const res = await request(app)
			.get('/api/info')
			.set('Cookie', cookie ?? []);

		expect(res.status).toBe(500);
		expect(res.body).toEqual({error: 'Internal Server Error'});

		vi.restoreAllMocks();
	});

	it('createApp handles missing origin', async () => {
		const app = await createApp();
		const res = await request(app).get('/api/health');
		expect(res.status).toBe(200);
	});

	it('createApp handles invalid origin and suppresses warning', async () => {
		const app = await createApp();
		// Trigger the origin callback with a non-allowed origin
		const res = await request(app).get('/api/health').set('Origin', 'http://unauthorized.com');
		expect(res.status).toBe(500);
		expect(res.body.error).toContain('Not allowed by CORS');
	});

	it('createApp handles express version load failure branch', async () => {
		const {configService} = await import('./services/config.service.ts');
		vi.spyOn(configService, 'getExpressVersion').mockResolvedValue('unknown');
		const app = await createApp();
		expect(app.get('express_load_error')).toBe('Failed to load');
		vi.restoreAllMocks();
	});
});
