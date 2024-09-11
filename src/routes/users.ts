import {
	authUserController,
	createUserController,
} from "@/controllers/users.controller";
import express from "express";

const router = express.Router();

router.post("/registration", createUserController);
router.post("/authentication", authUserController);

export default router;
