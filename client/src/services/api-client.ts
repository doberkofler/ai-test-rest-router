import type {z} from 'zod';
import {env} from '@client/env.ts';
import {SHARED_CONSTANTS} from '@shared/logic';

const API_BASE_URL = `${env.VITE_API_URL}${SHARED_CONSTANTS.API_BASE}`;

/**
 * Standard API error structure.
 */
export class ApiError extends Error {
	constructor(
		public status: number,
		message: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

/**
 * Centralized, type-safe API client.
 */
export const apiClient = {
	/**
	 * Generic request handler with Zod validation.
	 * @param path - URL path.
	 * @param options - Request options.
	 * @param schema - Zod schema for validation.
	 * @returns Parsed data.
	 */
	async request<T>(path: string, options: RequestInit = {}, schema?: z.ZodType<T>): Promise<T> {
		const url = `${API_BASE_URL}${path}`;
		const headers = new Headers(options.headers);
		if (!headers.has('Content-Type')) {
			headers.set('Content-Type', 'application/json');
		}

		const defaultOptions: RequestInit = {
			...options,
			headers,
			credentials: 'include',
		};

		let response: Response;
		try {
			response = await fetch(url, defaultOptions);
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : 'Network error';
			throw new ApiError(0, message);
		}

		if (!response.ok) {
			let errorMessage = `HTTP error! status: ${response.status?.toString() ?? 'unknown'}`;
			try {
				// clone() might not exist in all mock environments
				const res = typeof response.clone === 'function' ? response.clone() : response;
				const json = (await res.json()) as {error?: string};
				if (json.error) {
					errorMessage = json.error;
				}
			} catch {
				// Ignore parse errors on error responses
			}
			throw new ApiError(response.status ?? 0, errorMessage);
		}

		// Handle 204 No Content
		if (response.status === 204) {
			return undefined as T;
		}

		const data: unknown = await response.json();

		if (schema) {
			return schema.parse(data);
		}

		return data as T;
	},

	/**
	 * HTTP GET request.
	 * @param path - URL path.
	 * @param schema - Zod schema for validation.
	 * @param options - Request options.
	 * @returns Parsed data.
	 */
	async get<T>(path: string, schema?: z.ZodType<T>, options?: RequestInit): Promise<T> {
		return this.request<T>(path, {...options, method: 'GET'}, schema);
	},

	/**
	 * HTTP POST request.
	 * @param path - URL path.
	 * @param body - Request body.
	 * @param schema - Zod schema for validation.
	 * @param options - Request options.
	 * @returns Parsed data.
	 */
	async post<T>(path: string, body?: unknown, schema?: z.ZodType<T>, options?: RequestInit): Promise<T> {
		return this.request<T>(
			path,
			{
				...options,
				method: 'POST',
				body: body ? JSON.stringify(body) : undefined,
			},
			schema,
		);
	},
};
