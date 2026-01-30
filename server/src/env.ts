import {ServerEnvSchema} from '@shared/logic';

/**
 * Validates and exports environment variables.
 */
const result = ServerEnvSchema.safeParse(process.env);

if (!result.success) {
	const error = `❌ Invalid environment variables: ${JSON.stringify(result.error.format())}`;
	console.error(error);
	throw new Error(error);
}

export const env = result.data;
