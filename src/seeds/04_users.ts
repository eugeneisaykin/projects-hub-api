import bcrypt from "bcrypt";
import { Knex } from "knex";

const tableName = "users";

export async function seed(knex: Knex): Promise<void> {
	// Deletes ALL existing entries
	await knex(tableName).del();

	// Inserts seed entries
	await knex(tableName).insert([
		{
			username: "admin",
			first_name: "admin",
			last_name: "admin",
			email: "admin@gmail.com",
			password: await bcrypt.hash("adminadmin1", 10),
			role_id: 1,
		},
		{
			username: "lead",
			first_name: "lead",
			last_name: "lead",
			email: "lead@lead.com",
			password: await bcrypt.hash("leadlead1", 10),
			role_id: 2,
		},
		{
			username: "dev",
			first_name: "dev",
			last_name: "dev",
			email: "dev@gmail.com",
			password: await bcrypt.hash("devdev1", 10),
			role_id: 3,
		},
	]);
}
