import "module-alias/register";

import config from "@/config";
import routes from "@/routes";
import createConnectionDB from "@/services/objection.service";
import express from "express";
import errorHandler from "./middleware/errorHandler";
import { startSessionCleanupCron } from "./services/cron.service";

createConnectionDB(config.database);

const app = express();
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

startSessionCleanupCron("0 * * * *");

const PORT = config.port;

app.listen(PORT, () => {
	console.log(`Server run on ${PORT} PORT`);
});
