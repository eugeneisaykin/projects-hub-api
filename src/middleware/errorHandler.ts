import CustomError from "@/errors/customError";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
	error: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (error instanceof CustomError) {
		return res.status(error.status).json({
			success: false,
			message: error.message,
		});
	}

	return res.status(500).json({ success: false, message: "Unexpected error" });
};

export default errorHandler;
