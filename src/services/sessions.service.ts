import CustomError from "@/errors/customError";
import { IResult } from "ua-parser-js";
import lucia from "./lucia.service";
import { generateTokensService, verifyTokensService } from "./tokens.service";

interface ClientInfo {
	ipAddress: string;
	userAgent: IResult;
}

export const createSessionService = async (
	userId: number,
	clientInfo: ClientInfo
) => {
	const session = await lucia.createSession(String(userId), {
		user_agent: clientInfo.userAgent,
		ip_address: parseInt(clientInfo.ipAddress),
	});

	return generateTokensService(session.id);
};

export const verifySessionService = async (token: string) => {
	try {
		const decoded = await verifyTokensService(token);

		const { session, user } = await lucia.validateSession(decoded.id);

		if (!session || !user) throw new CustomError(500, "Error verify token");

		return { session, user };
	} catch (error) {
		throw new CustomError(500, "Error verify token");
	}
};

export const deleteSessionsService = async (
	logoutAllDevices: boolean,
	userId: string,
	sessionId: string
) => {
	try {
		if (logoutAllDevices) {
			await lucia.invalidateUserSessions(userId);
		} else {
			await lucia.invalidateSession(sessionId);
		}
	} catch (error: any) {
		throw new CustomError(500, "Error logout");
	}
};
