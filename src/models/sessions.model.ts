import { Model } from "objection";
import UserModel from "./users.model";

export default class SessionModel extends Model {
	date_change!: Date;

	static get tableName() {
		return "sessions";
	}

	static get relationMappings() {
		return {
			users: {
				relation: Model.BelongsToOneRelation,
				modelClass: UserModel,
				join: {
					from: "sessions.user_id",
					to: "users.id",
				},
			},
		};
	}

	async $beforeUpdate() {
		this.date_change = new Date();
	}
}
