import CustomError from "@/errors/customError";
import { createUserService } from "@/services/users.service";
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
			ipAddress: req.ip,
			userAgent: parser(req.headers["user-agent"]),
		};

		const userInfo = await createUserService(value, clientInfo);

		res.status(201).json({ success: true, message: "User created", userInfo });
	} catch (error: any) {
		console.log(error);
		next(error);
	}
};
