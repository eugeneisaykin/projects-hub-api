import {
	createRoleController,
	deleteRoleController,
	getAllRolesController,
} from "@/controllers/roles.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post(
	"/create",
	checkPermissions("role POST /create"),
	createRoleController
);
router.get("", checkPermissions("role GET /roles"), getAllRolesController);
router.delete(
	"/:roleId",
	checkPermissions("role DELETE"),
	deleteRoleController
);

export default router;
