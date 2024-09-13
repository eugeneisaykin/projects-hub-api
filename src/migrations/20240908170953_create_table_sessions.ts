import type { Knex } from "knex";

const tableName = "sessions";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex: Knex): Promise<void> {
	return knex.schema.hasTable(tableName).then(exists => {
		if (!exists) {
			return knex.schema.createTable(tableName, table => {
				table.string("id").notNullable().unique().primary();
				table.timestamp("expires_at").notNullable();
				table.json("user_agent").notNullable();
				table.integer("ip_address").unsigned().notNullable();
				table
					.integer("user_id")
					.unsigned()
					.references("id")
					.inTable("users")
					.onDelete("CASCADE");
				table.timestamp("date_added").defaultTo(knex.fn.now());
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
