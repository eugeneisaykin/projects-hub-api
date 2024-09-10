import * as dotenv from "dotenv";
dotenv.config();

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
	},
};
