import CustomError from "@/errors/customError";
import TaskModel from "@/models/tasks.model";

interface TaskInfo {
	name: string;
	description: string;
	startDate: Date;
	endDate: Date;
	priority: string;
	statusId: number;
	assigneeId: number;
	reviewerId: number;
}

export const createTaskService = async (taskInfo: TaskInfo) => {
	try {
		const task = await TaskModel.query()
			.insertAndFetch(taskInfo)
			.withGraphFetched("[assigneeUser, reviewerUser, statuses]")
			.modifyGraph("assigneeUser", builder => {
				builder.select("username", "first_name", "last_name");
			})
			.modifyGraph("reviewerUser", builder => {
				builder.select("username", "first_name", "last_name");
			})
			.modifyGraph("statuses", builder => {
				builder.select("name");
			});

		return task;
	} catch (error: any) {
		throw new CustomError(500, error.message);
	}
};
