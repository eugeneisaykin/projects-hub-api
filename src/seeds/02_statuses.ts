import { Knex } from "knex";

const tableName = "statuses";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex(tableName).del();

	// Inserts seed entries
	await knex(tableName).insert([
		{ name: "not_started", description: null },
		{ name: "in_progress", description: null },
		{ name: "completed", description: null },
		{ name: "on_hold", description: null },
	]);
}
