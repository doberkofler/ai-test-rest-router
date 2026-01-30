import {describe, it, expect} from 'vitest';
import request from 'supertest';
import express, {json} from 'express';
import cookieParser from 'cookie-parser';
import {randomUUID} from 'node:crypto';
import type {Request, Response} from 'express';

// Minimal mock of the auth logic for testing
const app = express();
app.use(json());
app.use(cookieParser());

const sessions = new Map<string, {username: string; lastActive: number}>();
const mockUser = {username: 'admin', password: 'secret', fullName: 'Admin'};

app.post('/api/auth/login', (req: Request, res: Response) => {
	const {username, password} = req.body as Record<string, string>;
	if (username === mockUser.username && password === mockUser.password) {
		const sid = randomUUID();
		sessions.set(sid, {username: mockUser.username, lastActive: Date.now()});
		res.cookie('sid', sid, {httpOnly: true}).json({username});
	} else {
		res.status(401).json({error: 'Invalid'});
	}
});

app.get('/api/protected', (req, res) => {
	const sid = (req.cookies as Record<string, string>)['sid'];
	if (sid && sessions.has(sid)) {
		res.json({ok: true});
	} else {
		res.status(401).json({error: 'Unauthorized'});
	}
});

describe('Authentication System', () => {
	it('Login with valid credentials sets cookie', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({username: 'admin', password: 'secret'});
		
		expect(res.status).toBe(200);
		expect(res.headers['set-cookie']).toBeDefined();
		expect((res.body as {username: string}).username).toBe('admin');
	});

	it('Login with invalid credentials returns 401', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({username: 'admin', password: 'wrong'});
		
		expect(res.status).toBe(401);
	});

	it('Access protected route without cookie returns 401', async () => {
		const res = await request(app).get('/api/protected');
		expect(res.status).toBe(401);
	});

	it('Access protected route with valid cookie returns 200', async () => {
		const loginRes = await request(app)
			.post('/api/auth/login')
			.send({username: 'admin', password: 'secret'});
		
		const cookie = loginRes.headers['set-cookie'];
		if (!cookie) throw new Error('No cookie returned');

		const res = await request(app)
			.get('/api/protected')
			.set('Cookie', cookie);
		
		expect(res.status).toBe(200);
		expect((res.body as {ok: boolean}).ok).toBe(true);
	});
});
