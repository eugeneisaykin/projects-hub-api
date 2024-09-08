import { Model } from "objection";
import RoleModel from "./roles.model";
import SessionModel from "./sessions.model";

export default class UserModel extends Model {
	date_change!: Date;

	static get tableName() {
		return "users";
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
		delete json.date_added;
		delete json.date_change;
		return json;
	}

	async $beforeUpdate() {
		this.date_change = new Date();
	}
}
