import "module-alias/register";

import config from "@/config";
import createConnectionDB from "@/services/objection.service";
import express from "express";

createConnectionDB(config.database);

const app = express();
app.use(express.json());

const PORT = config.port;

app.listen(PORT, () => {
	console.log(`Server run on ${PORT} PORT`);
});
