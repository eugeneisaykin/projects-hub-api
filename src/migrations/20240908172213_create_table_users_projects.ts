import type { Knex } from "knex";

const tableName = "users_projects";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex: Knex): Promise<void> {
	return knex.schema.hasTable(tableName).then(exists => {
		if (!exists) {
			return knex.schema.createTable(tableName, table => {
				table.increments("id").primary();
				table
					.integer("user_id")
					.unsigned()
					.notNullable()
					.references("id")
					.inTable("users")
					.onDelete("CASCADE");
				table
					.integer("project_id")
					.unsigned()
					.notNullable()
					.references("id")
					.inTable("projects")
					.onDelete("CASCADE");
				table.unique(["user_id", "project_id"]);
			});
		}
	});
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTableIfExists(tableName);
}
