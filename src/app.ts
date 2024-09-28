import "module-alias/register";

import config from "@/config";
import routes from "@/routes";
import createConnectionDB from "@/services/objection.service";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import errorHandler from "./middleware/errorHandler";
import { startSessionCleanupCron } from "./services/cron.service";

createConnectionDB(config.database);

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api", routes);
app.use(errorHandler);

startSessionCleanupCron(config.cronSchedule.cleanupSessionInterval);

const PORT = config.port;

app.listen(PORT, () => {
	console.log(`Server run on ${PORT} PORT`);
});
