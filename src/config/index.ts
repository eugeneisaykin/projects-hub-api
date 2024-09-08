import * as dotenv from "dotenv";
dotenv.config();

export default {
	port: process.env.PORT || 4444,
};
