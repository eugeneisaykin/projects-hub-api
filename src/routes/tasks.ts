import { createTaskController } from "@/controllers/tasks.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.post(
	"/create",
	checkPermissions("task POST /create"),
	createTaskController
);

export default router;
