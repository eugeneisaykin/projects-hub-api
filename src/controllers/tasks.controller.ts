import CustomError from "@/errors/customError";
import { createTaskService } from "@/services/tasks.service";
import { createTaskSchema } from "@/validations/tasks.validation";
import { NextFunction, Request, Response } from "express";

export const createTaskController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { error, value } = createTaskSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

		const taskInfo = await createTaskService(value);

		res.status(201).json({
			success: true,
			message: "Task created",
			taskInfo,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
