import config from "@/config";
import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import { Lucia, TimeSpan } from "lucia";
import mysql, { Pool } from "mysql2/promise";
import { IResult } from "ua-parser-js";
import createConnectionDB from "./objection.service";

createConnectionDB(config.database);

const pool: Pool = mysql.createPool(config.database.connection);

const adapter = new Mysql2Adapter(pool, {
	user: "users",
	session: "sessions",
});

const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(config.auth.session_lifetime_hours, "h"),
	getUserAttributes: attributes => {
		return {
			email: attributes.email,
			roleId: attributes.role_id,
			roleName: "",
		};
	},
	getSessionAttributes: attributes => {
		return {
			userAgent: attributes.user_agent,
			ipAddress: attributes.ip_address,
		};
	},
	sessionCookie: undefined,
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseSessionAttributes {
	user_agent: IResult;
	ip_address: number;
}

interface DatabaseUserAttributes {
	email: string;
	role_id: string;
	roleName: string;
}

export default lucia;
