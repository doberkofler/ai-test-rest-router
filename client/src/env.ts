import {ClientEnvSchema} from '@shared/logic';

/**
 * Validates and exports client-side environment variables.
 * In Vite, these must be prefixed with VITE_.
 */
const result = ClientEnvSchema.safeParse(import.meta.env);

// WHY: Schema validation for environment variables; fails early in development if misconfigured.
/* v8 ignore start */
if (!result.success) {
	console.error('❌ Invalid client environment variables:', result.error.format());
}
/* v8 ignore stop */

// WHY: Defensive fallback if environment variables are completely missing or invalid.
/* v8 ignore next */
export const env = result.data ?? ClientEnvSchema.parse({});
