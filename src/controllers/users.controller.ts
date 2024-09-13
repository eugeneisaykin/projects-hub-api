import CustomError from "@/errors/customError";
import { getRoleNameById } from "@/services/roles.service";
import {
	createSessionAndGetTokenService,
	deleteSessionsService,
} from "@/services/sessions.service";
import { authUserService, createUserService } from "@/services/users.service";
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
		const isUserAdmin =
			req.user && (await getRoleNameById(req.user.roleId)) === "admin";

		if ((!req.user || !req.session) && isAdminRole && !isUserAdmin) {
			throw new CustomError(403, "Forbidden");
		}

		const { error, value } = userSchema.validate(req.body);
		if (error) {
			const errorMessages = error.details.map(detail => detail.message);
			throw new CustomError(400, errorMessages.join(", "));
		}

		const clientInfo = {
			ipAddress: req.ip,
			userAgent: parser(req.headers["user-agent"]),
		};

		const userInfo = await createUserService(value);

		if (userInfo.role === "admin") {
			res
				.status(201)
				.json({ success: true, message: "Admin created", userInfo });
		} else {
			const sessionToken = await createSessionAndGetTokenService(
				userInfo,
				clientInfo
			);
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
			ipAddress: req.ip,
			userAgent: parser(req.headers["user-agent"]),
		};

		const userInfo = await authUserService(email, password);

		const sessionToken = await createSessionAndGetTokenService(
			userInfo,
			clientInfo
		);
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
