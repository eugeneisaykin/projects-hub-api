import config from "@/config";
import CustomError from "@/errors/customError";
import jwt, { JwtPayload } from "jsonwebtoken";

export const generateTokensService = (id: string) => {
	try {
		return jwt.sign({ id }, config.auth.token_secret_key, {
			expiresIn: config.auth.token_lifetime,
		});
	} catch (error) {
		throw new CustomError(500, "Error generate token");
	}
};

export const verifyTokensService = async (token: string) => {
	try {
		return jwt.verify(token, config.auth.token_secret_key) as JwtPayload;
	} catch (error) {
		throw new CustomError(500, "Error verify token");
	}
};
