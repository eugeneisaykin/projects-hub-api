import CustomError from "@/errors/customError";
import { getAllRolesService } from "@/services/roles.service";
import { NextFunction, Request, Response } from "express";

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
