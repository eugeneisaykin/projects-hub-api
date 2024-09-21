import CustomError from "@/errors/customError";
import {
	createRoleService,
	getAllRolesService,
} from "@/services/roles.service";
import { roleSchema } from "@/validations/roles.validation";
import { NextFunction, Request, Response } from "express";

export const createRoleController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.session || !req.user) {
			throw new CustomError(401, "Unauthorized");
		}

		const { error, value } = roleSchema.validate(req.body);
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

		const roleInfo = await createRoleService(value);
		res.status(200).json({
			success: true,
			roleInfo,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const getAllRolesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.session || !req.user) {
			throw new CustomError(401, "Unauthorized");
		}

		const allRoles = await getAllRolesService();
		res.status(200).json({
			success: true,
			size: allRoles.length,
			allRoles,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
