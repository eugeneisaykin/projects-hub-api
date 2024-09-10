import { Model, snakeCaseMappers } from "objection";
import UserModel from "./users.model";

export default class RoleModel extends Model {
	id!: number;
	name!: string;
	description!: string;
	dateAdded!: Date;
	dateChange!: Date;

	static get tableName() {
		return "roles";
	}

	static get columnNameMappers() {
		return snakeCaseMappers();
	}

	static get relationMappings() {
		return {
			users: {
				relation: Model.HasManyRelation,
				modelClass: UserModel,
				join: {
					from: "roles.id",
					to: "users.roleId",
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
