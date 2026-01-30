import {z} from 'zod';

export const UserSchema = z.object({
	username: z.string(),
	password: z.string(),
	fullName: z.string(),
});

export const OptionsSchema = z.object({
	sessionTimeoutMinutes: z.number().min(1).max(1440),
});

export const LoginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export const ServerInfoSchema = z.object({
	startTimestamp: z.string().datetime(),
	serverTime: z.string().datetime(),
	nodeVersion: z.string(),
	expressVersion: z.string(),
	user: z
		.object({
			username: z.string(),
			fullName: z.string(),
			loginTimestamp: z.string().datetime(),
		})
		.nullable(),
});

/**
 * Shared constants
 */
export const SHARED_CONSTANTS = {
	DEFAULT_PORT: 3000,
	API_BASE: '/api',
	COOKIE_NAME: 'session_id',
} as const;

/**
 * API Response schemas
 */
export const ApiErrorSchema = z.object({
	error: z.string(),
});

export const HealthResponseSchema = z.object({
	status: z.literal('ok'),
});

/**
 * Environment validation schemas
 */
export const ServerEnvSchema = z.object({
	PORT: z
		.string()
		.default(String(SHARED_CONSTANTS.DEFAULT_PORT))
		.transform(Number),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const ClientEnvSchema = z.object({
	VITE_API_URL: z.string().url().default('http://localhost:3000'),
});

export type User = z.infer<typeof UserSchema>;
export type Options = z.infer<typeof OptionsSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ServerInfo = z.infer<typeof ServerInfoSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type ServerEnv = z.infer<typeof ServerEnvSchema>;
export type ClientEnv = z.infer<typeof ClientEnvSchema>;
