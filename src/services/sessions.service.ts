import config from "@/config";
import CustomError from "@/errors/customError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IResult } from "ua-parser-js";
import lucia from "./lucia.service";

interface User {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

interface SessionDTO {
	id: string;
	userId: string;
}

interface ClientInfo {
	ipAddress: string | undefined;
	userAgent: IResult;
}

export const createSessionAndGetTokenService = async (
	user: User,
	clientInfo: ClientInfo
) => {
	const session = await lucia.createSession(String(user.id), {
		user_agent: clientInfo.userAgent,
		ip_address: parseInt(clientInfo.ipAddress || "0"),
	});

	const sessionDTO = {
		id: session.id,
		userId: session.userId,
	};

	const tokenSession = generateTokensService({ ...sessionDTO });

	return tokenSession;
};

export const generateTokensService = (payload: SessionDTO) => {
	try {
		return jwt.sign(payload, config.auth.token_secret_key, {
			expiresIn: "30m",
		});
	} catch (error) {
		throw new CustomError(500, "Error generate token");
	}
};

export const verifyTokenAndGetSessionService = async (token: string) => {
	try {
		const decoded = jwt.verify(
			token,
			config.auth.token_secret_key
		) as JwtPayload;

		if (!decoded)
			throw new CustomError(401, "An unexpected error has occurred");

		const { session, user } = await lucia.validateSession(decoded.id);

		if (!session || !user) throw new CustomError(500, "Error verify token");

		return { session, user };
	} catch (error) {
		throw new CustomError(500, "Error verify token");
	}
};
