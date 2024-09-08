import knex from "knex";
import { Model } from "objection";

export const createConnectionDB = (config: any) => {
	const database = knex(config);
	Model.knex(database);
	return database;
};

export default createConnectionDB;
