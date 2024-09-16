import CustomError from "@/errors/customError";
import {
	createSessionService,
	deleteSessionsService,
} from "@/services/sessions.service";
import {
	authUserService,
	createUserService,
	getAllUsersService,
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
		const isAdminRole = req.body.role === "admin";
		const isUserAdmin = req?.user?.roles.name === "admin";

		if (!req.session && !isUserAdmin && isAdminRole) {
			throw new CustomError(403, "Forbidden");
		}

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

		if (userInfo?.roles?.name === "admin") {
			res
				.status(201)
				.json({ success: true, message: "Admin created", userInfo });
		} else {
			const sessionToken = await createSessionService(userInfo.id, clientInfo);
			res.status(201).json({
				success: true,
				message: "User created",
				userInfo,
				sessionToken,
			});
		}
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
			throw new CustomError(403, "Forbidden");
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
			throw new CustomError(403, "Forbidden");
		}

		const { role } = req.query;

		const allUsers = await getAllUsersService(role as string);
		res.status(200).json({
			success: true,
			allUsers,
		});
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
