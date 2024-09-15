import {
	authUserController,
	createUserController,
	getAllUsersController,
	logoutUserController,
} from "@/controllers/users.controller";
import express from "express";

const router = express.Router();

router.post("/registration", createUserController);
router.post("/authentication", authUserController);
router.post("/logout", logoutUserController);
router.get("", getAllUsersController);

export default router;
