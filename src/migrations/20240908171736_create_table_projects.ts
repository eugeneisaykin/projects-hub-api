import type { Knex } from "knex";

const tableName = "projects";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex: Knex): Promise<void> {
	return knex.schema.hasTable(tableName).then(exists => {
		if (!exists) {
			return knex.schema.createTable(tableName, table => {
				table.increments("id").primary();
				table.string("name").notNullable().unique();
				table.text("description").nullable();
				table.date("start_date").notNullable();
				table.date("end_date").nullable();
				table
					.integer("status_id")
					.unsigned()
					.references("id")
					.inTable("statuses")
					.onDelete("SET NULL");
				table.timestamp("date_added").defaultTo(knex.fn.now());
				table.timestamp("date_change").defaultTo(knex.fn.now());
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
