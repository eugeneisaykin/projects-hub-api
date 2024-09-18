import CustomError from "@/errors/customError";
import {
	createSessionService,
	deleteSessionsService,
} from "@/services/sessions.service";
import {
	authUserService,
	createUserService,
	getAllUsersService,
	updateUserRoleService,
} from "@/services/users.service";
import { userSchema } from "@/validations/users.validation";
import { NextFunction, Request, Response } from "express";
import parser from "ua-parser-js";

export const createUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { error, value } = userSchema.validate(req.body);
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

		const clientInfo = {
			ipAddress: req.ip || "127.0.0.1",
			userAgent: parser(req.headers["user-agent"]),
		};

		const userInfo = await createUserService(value);

		const sessionToken = await createSessionService(userInfo.id, clientInfo);
		res.status(201).json({
			success: true,
			message: "User created",
			userInfo,
			sessionToken,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const authUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { email, password } = req.body;
		const clientInfo = {
			ipAddress: req.ip || "127.0.0.1",
			userAgent: parser(req.headers["user-agent"]),
		};

		const userInfo = await authUserService(email, password);

		const sessionToken = await createSessionService(userInfo.id, clientInfo);
		res
			.status(201)
			.json({ success: true, message: "User auth", userInfo, sessionToken });
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const logoutUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		if (!req.user || !req.session) {
			throw new CustomError(401, "Unauthorized");
		}

		const { logoutAllDevices = false } = req.body;

		await deleteSessionsService(logoutAllDevices, req.user.id, req.session.id);
		res.status(200).json({ success: true, message: "Successful Logout" });
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const getAllUsersController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.user || !req.session) {
			throw new CustomError(401, "Unauthorized");
		}

		const { role } = req.query;

		const allUsers = await getAllUsersService(role as string);
		res.status(200).json({
			success: true,
			size: allUsers.length,
			allUsers,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const updateUserRoleController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		if (!req.user || !req.session) {
			throw new CustomError(401, "Unauthorized");
		}

		const { userId } = req.params;

		if (!userId) {
			throw new CustomError(400, "User ID is required");
		}

		const { newRole } = req.body;

		const updatedUserInfo = await updateUserRoleService(+userId, newRole);

		res.status(200).json({
			success: true,
			message: `Role updated to ${newRole}`,
			updatedUserInfo,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
