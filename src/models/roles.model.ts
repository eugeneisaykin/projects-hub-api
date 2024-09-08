import { Model } from "objection";
import UserModel from "./users.model";

export default class RoleModel extends Model {
	date_change!: Date;

	static get tableName() {
		return "roles";
	}

	static get relationMappings() {
		return {
			users: {
				relation: Model.HasManyRelation,
				modelClass: UserModel,
				join: {
					from: "roles.id",
					to: "users.role_id",
				},
			},
		};
	}

	async $beforeUpdate() {
		this.date_change = new Date();
	}
}
