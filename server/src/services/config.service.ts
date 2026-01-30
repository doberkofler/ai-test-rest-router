import {readFile, writeFile} from 'node:fs/promises';
import {OptionsSchema, UserSchema} from '../shared/schemas.ts';
import type {Options, User} from '../shared/schemas.ts';

/**
 * Service for managing application configuration and user data.
 */
class ConfigService {
	private options: Options = {sessionTimeoutMinutes: 60};
	private users: User[] = [];

	/**
	 * Exposed for testing to allow branch coverage without ESM mocking issues.
	 * @param path - URL to read.
	 * @returns File content.
	 */
	async readLocalFile(path: URL | string) {
		return readFile(path, 'utf8');
	}

	/**
	 * Loads configuration from JSON files.
	 */
	async loadConfig() {
		try {
			const optionsData = await this.readLocalFile(new URL('../../data/options.json', import.meta.url));
			this.options = OptionsSchema.parse(JSON.parse(optionsData));
			
			const usersData = await this.readLocalFile(new URL('../../data/users.json', import.meta.url));
			this.users = UserSchema.array().parse(JSON.parse(usersData));
		} catch (error) {
			console.error('Failed to load configuration', error);
			throw error;
		}
	}

	/**
	 * Gets current options.
	 * @returns Current options.
	 */
	getOptions(): Options {
		return this.options;
	}

	/**
	 * Updates and persists options.
	 * @param newOptions - New options to save.
	 */
	async updateOptions(newOptions: Options) {
		this.options = OptionsSchema.parse(newOptions);
		await writeFile(
			new URL('../../data/options.json', import.meta.url),
			JSON.stringify(this.options, null, '\t'),
			'utf8'
		);
	}

	/**
	 * Gets all users.
	 * @returns List of users.
	 */
	getUsers(): User[] {
		return this.users;
	}
}

export const configService = new ConfigService();
export default configService;
