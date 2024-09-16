import CustomError from "@/errors/customError";
import { getAllRolesService } from "@/services/roles.service";
import { getUserFromDB } from "@/services/users.service";
import { NextFunction, Request, Response } from "express";

export const getAllRolesController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const userInfo = await getUserFromDB(req?.user?.email as string);
		const isUserAdmin = userInfo?.roles?.name === "admin";

		if (!req.session && !isUserAdmin) {
			throw new CustomError(403, "Forbidden");
		}

		const allRoles = await getAllRolesService();
		res.status(200).json({
			success: true,
			allRoles,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
