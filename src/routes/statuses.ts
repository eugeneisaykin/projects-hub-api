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
	"/all",
	checkPermissions("status GET /all"),
	getAllStatusesController
);
router.delete(
	"/:statusId",
	checkPermissions("status DELETE"),
	deleteStatusController
);

export default router;
