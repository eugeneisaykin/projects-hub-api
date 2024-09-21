import {
	authUserController,
	createUserController,
	getAllUsersController,
	logoutUserController,
	updateUserRoleController,
} from "@/controllers/users.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post("/registration", createUserController);
router.post("/authentication", authUserController);
router.post("/logout", logoutUserController);
router.get("", checkPermissions("GET /users"), getAllUsersController);
router.patch(
	"/:userId/update-role",
	checkPermissions("PATCH user /update-role"),
	updateUserRoleController
);

export default router;
