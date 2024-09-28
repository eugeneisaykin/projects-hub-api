import CustomError from "@/errors/customError";
import {
	createRoleService,
	deleteRoleService,
	getAllRolesService,
} from "@/services/roles.service";
import { createRoleSchema } from "@/validations/roles.validation";
import { NextFunction, Request, Response } from "express";

export const createRoleController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { error, value } = createRoleSchema.validate(req.body);
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

export const deleteRoleController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { roleId } = req.params;

		if (!roleId) {
			throw new CustomError(400, "Role ID is required");
		}

		await deleteRoleService(+roleId);

		res.status(200).json({
			success: true,
			message: `Deleted a role with an ID ${roleId}`,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
