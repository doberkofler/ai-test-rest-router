import {ClientEnvSchema} from '@shared/logic';

/**
 * Validates and exports client-side environment variables.
 * In Vite, these must be prefixed with VITE_.
 */
const result = ClientEnvSchema.safeParse(import.meta.env);

if (!result.success) {
	console.error('❌ Invalid client environment variables:', result.error.format());
}

export const env = result.data ?? ClientEnvSchema.parse({});
