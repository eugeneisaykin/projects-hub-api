import type { Knex } from "knex";

const tableName = "users";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex: Knex): Promise<void> {
	return knex.schema.hasTable(tableName).then(exists => {
		if (!exists) {
			return knex.schema.createTable(tableName, table => {
				table.increments("id").primary();
				table.string("username").notNullable().unique();
				table.string("first_name").notNullable();
				table.string("last_name").notNullable();
				table.string("email").notNullable().unique();
				table.text("password").notNullable();
				table
					.integer("role_id")
					.unsigned()
					.references("id")
					.inTable("roles")
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
