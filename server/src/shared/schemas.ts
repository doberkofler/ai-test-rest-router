/* eslint-disable @typescript-eslint/no-deprecated */
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
	user: z.object({
		username: z.string(),
		fullName: z.string(),
		loginTimestamp: z.string().datetime(),
	}).nullable(),
});

export type User = z.infer<typeof UserSchema>;
export type Options = z.infer<typeof OptionsSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ServerInfo = z.infer<typeof ServerInfoSchema>;
