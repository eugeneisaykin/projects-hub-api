import { Model, snakeCaseMappers } from "objection";
import StatusModel from "./statuses.model";
import UserModel from "./users.model";

export default class TaskModel extends Model {
	id!: number;
	name!: string;
	description!: string;
	startDate!: Date;
	endDate!: Date;
	priority!: string;
	statusId!: number;
	assigneeId!: number;
	reviewerId!: number;
	dateAdded!: Date;
	dateChange!: Date;
	statuses?: StatusModel;
	assigneeUser?: UserModel;
	reviewerUser?: UserModel;

	static get tableName() {
		return "tasks";
	}

	static get columnNameMappers() {
		return snakeCaseMappers();
	}

	static get relationMappings() {
		return {
			statuses: {
				relation: Model.BelongsToOneRelation,
				modelClass: StatusModel,
				join: {
					from: "tasks.status_id",
					to: "statuses.id",
				},
			},
			assigneeUser: {
				relation: Model.BelongsToOneRelation,
				modelClass: UserModel,
				join: {
					from: "tasks.assigneeId",
					to: "users.id",
				},
			},
			reviewerUser: {
				relation: Model.BelongsToOneRelation,
				modelClass: UserModel,
				join: {
					from: "tasks.reviewerId",
					to: "users.id",
				},
			},
		};
	}

	$formatJson(json: any) {
		json = super.$formatJson(json);
		delete json.dateAdded;
		delete json.dateChange;
		delete json.statusId;
		delete json.assigneeId;
		delete json.reviewerId;
		return json;
	}

	async $beforeUpdate() {
		this.dateChange = new Date();
	}
}
