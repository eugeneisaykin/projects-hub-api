import * as dotenv from "dotenv";
import { knexSnakeCaseMappers } from "objection";

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

dotenv.config();

export default {
	development: {
		client: process.env.DB_CLIENT,
		connection: {
			database: process.env.DB_DATABASE,
			user: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: "knex_migrations",
			directory: "./src/migrations",
			extension: "ts",
		},
		seeds: {
			tableName: "knex_seeds",
			directory: "./src/seeds",
			extension: "ts",
		},
		...knexSnakeCaseMappers,
	},
};
