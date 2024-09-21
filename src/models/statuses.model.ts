import { Model, snakeCaseMappers } from "objection";

export default class StatusModel extends Model {
	id!: number;
	name!: string;
	description!: string;
	dateAdded!: Date;
	dateChange!: Date;

	static get tableName() {
		return "statuses";
	}

	static get columnNameMappers() {
		return snakeCaseMappers();
	}

	$formatJson(json: any) {
		json = super.$formatJson(json);
		delete json.dateAdded;
		delete json.dateChange;
		return json;
	}

	async $beforeUpdate() {
		this.dateChange = new Date();
	}
}
