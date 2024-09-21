import {
	createRoleController,
	getAllRolesController,
} from "@/controllers/roles.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post(
	"/create",
	checkPermissions("POST role /create"),
	createRoleController
);
router.get("", checkPermissions("GET /roles"), getAllRolesController);

export default router;
