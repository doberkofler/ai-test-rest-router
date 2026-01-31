import {describe, it, expect, vi, beforeEach} from 'vitest';
import {apiClient, ApiError} from './api-client.ts';
import {z} from 'zod';

describe('apiClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('should make a successful GET request', async () => {
		const mockData = {foo: 'bar'};
		const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			Response.json(mockData, {
				status: 200,
			}),
		);

		const result = await apiClient.get('/test');
		expect(result).toEqual(mockData);
		expect(fetchSpy).toHaveBeenCalledWith(expect.stringContaining('/api/test'), expect.any(Object));
	});

	it('should validate response with schema', async () => {
		const mockData = {foo: 'bar'};
		const schema = z.object({foo: z.string()});
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			Response.json(mockData, {
				status: 200,
			}),
		);

		const result = await apiClient.get('/test', schema);
		expect(result).toEqual(mockData);
	});

	it('should throw error if schema validation fails', async () => {
		const mockData = {foo: 123}; // Wrong type
		const schema = z.object({foo: z.string()});
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			Response.json(mockData, {
				status: 200,
			}),
		);

		await expect(apiClient.get('/test', schema)).rejects.toThrow();
	});

	it('should handle 204 No Content', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(null, {
				status: 204,
			}),
		);

		const result = await apiClient.post('/test');
		expect(result).toBeUndefined();
	});

	it('should handle HTTP errors with JSON body', async () => {
		const errorMsg = 'Invalid credentials';
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			Response.json(
				{error: errorMsg},
				{
					status: 401,
				},
			),
		);

		try {
			await apiClient.get('/test');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
			expect((error as ApiError).message).toBe(errorMsg);
		}
	});

	it('should handle HTTP errors without JSON body', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('Plain text error', {
				status: 500,
			}),
		);

		try {
			await apiClient.get('/test');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(500);
			expect((error as ApiError).message).toContain('HTTP error! status: 500');
		}
	});

	it('should handle HTTP errors with malformed JSON', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('{"invalid": ', {
				status: 500,
				headers: {'Content-Type': 'application/json'},
			}),
		);

		try {
			await apiClient.get('/test');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(500);
		}
	});

	it('should handle network errors (Failed to fetch)', async () => {
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

		try {
			await apiClient.get('/test');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).message).toContain('Network error: Connection refused or CORS block');
		}
	});

	it('should handle generic network errors', async () => {
		vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unknown network error'));

		try {
			await apiClient.get('/test');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).message).toBe('Unknown network error');
		}
	});
});
