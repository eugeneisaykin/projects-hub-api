import "module-alias/register";

import config from "@/config";
import express from "express";

const app = express();
app.use(express.json());

const PORT = config.port;

app.listen(PORT, () => {
	console.log(`Server run on ${PORT} PORT`);
});
