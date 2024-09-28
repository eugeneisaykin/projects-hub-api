import config from "@/config";
import lucia from "@/services/lucia.service";
import { getRoleInfo } from "@/services/roles.service";
import { verifySessionService } from "@/services/sessions.service";
import { generateTokensService } from "@/services/tokens.service";
import { NextFunction, Request, Response } from "express";
import type { Session, User } from "lucia";

export const authenticateToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = lucia.readBearerToken(req.headers.authorization ?? "");

	if (!token) {
		req.user = null;
		req.session = null;
		return next();
	}

	try {
		const { session, user } = await verifySessionService(token);

		if (session && session.fresh) {
			const newToken = generateTokensService(session.id);
			res.setHeader("Authorization", `Bearer ${newToken}`);
		}

		if (!session) {
			req.session = null;
			req.user = null;
		} else {
			req.session = session;
			req.user = user;
		}

		next();
	} catch (err: any) {
		req.user = null;
		req.session = null;

		return res.status(401).json({ success: false, message: "Unauthorized" });
	}
};

export const checkPermissions = (requiredPermission: string) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			if (!req.user || !req.session) {
				return res
					.status(401)
					.json({ success: false, message: "Unauthorized" });
			}
			const roleInfo = await getRoleInfo(Number(req.user?.roleId));

			if (!roleInfo) {
				return res
					.status(404)
					.json({ success: false, message: "Role not found" });
			}

			const userRole = roleInfo.name;

			const permissions = config.rolePermissions[userRole] || [];

			if (permissions.includes(requiredPermission)) {
				return next();
			}
			return res.status(403).json({ success: false, message: "Access denied" });
		} catch (error) {
			return res.status(403).json({ success: false, message: "Access denied" });
		}
	};
};

declare global {
	namespace Express {
		interface Request {
			user: User | null;
			session: Session | null;
		}
	}
}
