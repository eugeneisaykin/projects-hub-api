import { Model, snakeCaseMappers } from "objection";
import UserModel from "./users.model";

export default class SessionModel extends Model {
	id!: string;
	expiresAt!: Date;
	userAgent!: JSON;
	ipAddress!: number;
	userId!: number;
	dateAdded!: Date;
	dateChange!: Date;

	static get tableName() {
		return "sessions";
	}

	static get columnNameMappers() {
		return snakeCaseMappers();
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
		this.dateChange = new Date();
	}
}
