import { Knex } from "knex";

const tableName = "projects";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex(tableName).del();

	// Inserts seed entries
	await knex(tableName).insert([
		{
			name: "Projects Hub Backend",
			description: "Backend service for a project management application",
			start_date: "2024-09-08",
			end_date: null,
			status_id: 2,
		},
	]);
}
