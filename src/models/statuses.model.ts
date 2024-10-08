import { Model, snakeCaseMappers } from "objection";
import TaskModel from "./tasks.model";

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

	static get relationMappings() {
		return {
			tasks: {
				relation: Model.HasManyRelation,
				modelClass: TaskModel,
				join: {
					from: "statuses.id",
					to: "tasks.status_id",
				},
			},
		};
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
