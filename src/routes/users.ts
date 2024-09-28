import {
	authUserController,
	createUserController,
	deleteUserController,
	getAllUsersController,
	logoutUserController,
	updateUserController,
	updateUserRoleController,
} from "@/controllers/users.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post("/registration", createUserController);
router.post("/authentication", authUserController);
router.post("/logout", logoutUserController);
router.get("/all", checkPermissions("user GET /all"), getAllUsersController);
router.patch(
	"/:userId/update-role",
	checkPermissions("user PATCH /update-role"),
	updateUserRoleController
);
router.patch("/update", updateUserController);
router.delete(
	"/:userId",
	checkPermissions("user DELETE"),
	deleteUserController
);

export default router;
