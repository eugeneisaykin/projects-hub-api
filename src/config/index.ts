import * as dotenv from "dotenv";
dotenv.config();

interface RolePermissions {
	[key: string]: string[];
}

const rolePermissions: RolePermissions = {
	admin: [
		"user GET /all",
		"user PATCH /update-role",
		"user DELETE",
		"role POST /create",
		"role GET /all",
		"role DELETE",
		"status POST /create",
		"status GET /all",
		"status DELETE",
		"task POST /create",
	],
	lead: [],
	programmer: [],
};

export default {
	port: process.env.PORT || 4444,
	database: {
		client: process.env.DB_CLIENT || "mysql2",
		connection: {
			database: process.env.DB_DATABASE || "projects_hub",
			user: process.env.DB_USERNAME || "root",
			password: process.env.DB_PASSWORD || "",
			host: process.env.DB_HOST || "127.0.0.1",
		},
	},
	auth: {
		saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"),
		token_secret_key: process.env.TOKEN_SECRET_KEY || "",
		token_lifetime: process.env.TOKEN_LIFETIME || "2h",
		session_lifetime_hours: parseInt(process.env.SESSION_LIFETIME_HOURS || "2"),
	},
	cronSchedule: {
		cleanupSessionInterval:
			process.env.CRON_CLEANUP_SESSION_INTERVAL || "0 * * * *",
	},
	defaultUserInfo: {
		role: "programmer",
	},
	rolePermissions,
};
