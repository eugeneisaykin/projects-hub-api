import {
	createStatusController,
	deleteStatusController,
	getAllStatusesController,
} from "@/controllers/statuses.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post(
	"/create",
	checkPermissions("status POST /create"),
	createStatusController
);
router.get(
	"",
	checkPermissions("status GET /statuses"),
	getAllStatusesController
);
router.delete(
	"/:statusId",
	checkPermissions("status DELETE"),
	deleteStatusController
);

export default router;
