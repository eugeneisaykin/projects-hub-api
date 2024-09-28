import CustomError from "@/errors/customError";
import {
	createStatusService,
	deleteStatusService,
	getAllStatusesService,
} from "@/services/statuses.service";
import { createStatusSchema } from "@/validations/statuses.validation";
import { NextFunction, Request, Response } from "express";

export const createStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { error, value } = createStatusSchema.validate(req.body);
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

		const statusInfo = await createStatusService(value);
		res.status(200).json({
			success: true,
			statusInfo,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const getAllStatusesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const allStatuses = await getAllStatusesService();
		res.status(200).json({
			success: true,
			size: allStatuses.length,
			allStatuses,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const deleteStatusController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { statusId } = req.params;

		if (!statusId) {
			throw new CustomError(400, "Status ID is required");
		}

		await deleteStatusService(+statusId);

		res.status(200).json({
			success: true,
			message: `Deleted a status with an ID ${statusId}`,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
