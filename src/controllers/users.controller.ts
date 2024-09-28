import CustomError from "@/errors/customError";
import {
	createSessionService,
	deleteSessionsService,
} from "@/services/sessions.service";
import {
	authUserService,
	createUserService,
	deleteUserService,
	getAllUsersService,
	updateUserRoleService,
	updateUserService,
} from "@/services/users.service";
import {
	userRoleFilterSchema,
	userRoleSchema,
} from "@/validations/roles.validation";
import {
	authUserSchema,
	createUserSchema,
	logoutUserSchema,
	updateUserSchema,
} from "@/validations/users.validation";
import { NextFunction, Request, Response } from "express";
import parser from "ua-parser-js";

export const createUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { error, value } = createUserSchema.validate(req.body, {
			abortEarly: false,
		});
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
		const { error } = authUserSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

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

		const { error } = logoutUserSchema.validate(req.body);
		if (error) {
			throw new CustomError(400, error.details[0].message);
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
		const { role } = req.query;

		const { error } = userRoleFilterSchema.validate(req.query);
		if (error) {
			throw new CustomError(400, error.details[0].message);
		}

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
		const { userId } = req.params;

		if (!userId) {
			throw new CustomError(400, "User ID is required");
		}

		const { error } = userRoleSchema.validate(req.body);
		if (error) {
			throw new CustomError(400, error.details[0].message);
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

export const deleteUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { userId } = req.params;

		if (!userId) {
			throw new CustomError(400, "User ID is required");
		}

		await deleteUserService(+userId);

		res.status(200).json({
			success: true,
			message: `Deleted a user with an ID ${userId}`,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};

export const updateUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		if (!req.user || !req.session) {
			throw new CustomError(401, "Unauthorized");
		}

		const { error, value } = updateUserSchema.validate(req.body, {
			abortEarly: false,
		});
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

		const updatedUserInfo = await updateUserService(req.user.id, value);
		res.status(201).json({
			success: true,
			message: "User Update",
			update: Object.keys(value),
			updatedUserInfo,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
