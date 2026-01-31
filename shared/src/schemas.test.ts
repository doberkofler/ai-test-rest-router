import {describe, it, expect} from 'vitest';
import {UserSchema, OptionsSchema, LoginSchema, ServerInfoSchema, ApiErrorSchema, HealthResponseSchema, ServerEnvSchema, ClientEnvSchema} from './schemas.ts';

describe('Shared Schemas', () => {
	describe('UserSchema', () => {
		it('should validate valid user', () => {
			const user = {username: 'admin', password: 'password', fullName: 'Administrator'};
			expect(UserSchema.parse(user)).toEqual(user);
		});

		it('should reject invalid user', () => {
			const user = {username: 'admin'};
			expect(() => UserSchema.parse(user)).toThrow();
		});
	});

	describe('OptionsSchema', () => {
		it('should validate valid options', () => {
			const options = {sessionTimeoutMinutes: 60};
			expect(OptionsSchema.parse(options)).toEqual(options);
		});

		it('should reject out of range timeout', () => {
			expect(() => OptionsSchema.parse({sessionTimeoutMinutes: 0})).toThrow();
			expect(() => OptionsSchema.parse({sessionTimeoutMinutes: 1441})).toThrow();
		});
	});

	describe('LoginSchema', () => {
		it('should validate valid login', () => {
			const login = {username: 'admin', password: 'password'};
			expect(LoginSchema.parse(login)).toEqual(login);
		});
	});

	describe('ServerInfoSchema', () => {
		it('should validate valid server info', () => {
			const info = {
				startTimestamp: new Date().toISOString(),
				serverTime: new Date().toISOString(),
				nodeVersion: 'v20.0.0',
				expressVersion: '5.0.0',
				user: {
					username: 'admin',
					fullName: 'Admin',
					loginTimestamp: new Date().toISOString(),
				},
			};
			expect(ServerInfoSchema.parse(info)).toEqual(info);
		});

		it('should allow null user', () => {
			const info = {
				startTimestamp: new Date().toISOString(),
				serverTime: new Date().toISOString(),
				nodeVersion: 'v20.0.0',
				expressVersion: '5.0.0',
				user: null,
			};
			expect(ServerInfoSchema.parse(info)).toEqual(info);
		});
	});

	describe('ApiErrorSchema', () => {
		it('should validate valid error', () => {
			const error = {error: 'Something went wrong'};
			expect(ApiErrorSchema.parse(error)).toEqual(error);
		});
	});

	describe('HealthResponseSchema', () => {
		it('should validate valid health response', () => {
			const health = {status: 'ok'};
			expect(HealthResponseSchema.parse(health)).toEqual(health);
		});
	});

	describe('ServerEnvSchema', () => {
		it('should validate and transform server env', () => {
			const env = {PORT: '4000', NODE_ENV: 'production'};
			expect(ServerEnvSchema.parse(env)).toEqual({PORT: 4000, NODE_ENV: 'production'});
		});

		it('should use defaults', () => {
			expect(ServerEnvSchema.parse({})).toEqual({PORT: 3000, NODE_ENV: 'development'});
		});
	});

	describe('ClientEnvSchema', () => {
		it('should validate valid client env', () => {
			const env = {VITE_API_URL: 'http://localhost:3000'};
			expect(ClientEnvSchema.parse(env)).toEqual(env);
		});

		it('should reject invalid URL', () => {
			expect(() => ClientEnvSchema.parse({VITE_API_URL: 'not-a-url'})).toThrow();
		});
	});
});
