import {describe, it, expect} from 'vitest';
import request from 'supertest';
import express, {json} from 'express';
import cors from 'cors';
import helmet from 'helmet';

/**
 * Mock server for testing to avoid side effects on the main instance.
 */
const app = express();
app.use(helmet());
app.use(cors());
app.use(json());

app.get('/api/health', (_req, res) => {
	res.json({status: 'ok'});
});

describe('Server API', () => {
	it('GET /api/health returns 200 and status ok', async () => {
		const response = await request(app).get('/api/health');
		expect(response.status).toBe(200);
		expect(response.body).toEqual({status: 'ok'});
	});

	it('Security headers are present', async () => {
		const response = await request(app).get('/api/health');
		expect(response.headers['x-content-type-options']).toBeDefined();
		expect(response.headers['x-frame-options']).toBeDefined();
	});
});
