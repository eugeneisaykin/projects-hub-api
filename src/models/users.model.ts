import { Model, snakeCaseMappers } from "objection";
import RoleModel from "./roles.model";
import SessionModel from "./sessions.model";

export default class UserModel extends Model {
	id!: number;
	username!: string;
	firstName!: string;
	lastName!: string;
	email!: string;
	roleId!: number;
	password!: string;
	dateAdded!: Date;
	dateChange!: Date;
	roles?: RoleModel;

	static get tableName() {
		return "users";
	}

	static get columnNameMappers() {
		return snakeCaseMappers();
	}

	static get relationMappings() {
		return {
			roles: {
				relation: Model.BelongsToOneRelation,
				modelClass: RoleModel,
				join: {
					from: "users.role_id",
					to: "roles.id",
				},
			},
			sessions: {
				relation: Model.HasManyRelation,
				modelClass: SessionModel,
				join: {
					from: "users.id",
					to: "sessions.user_id",
				},
			},
		};
	}

	$formatJson(json: any) {
		json = super.$formatJson(json);
		delete json.password;
		delete json.roleId;
		delete json.dateAdded;
		delete json.dateChange;
		return json;
	}

	async $beforeUpdate() {
		this.dateChange = new Date();
	}
}
