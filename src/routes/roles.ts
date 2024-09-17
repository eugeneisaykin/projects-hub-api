import { getAllRolesController } from "@/controllers/roles.controller";
import { checkPermissions } from "@/middleware/auth";
import express from "express";

const router = express.Router();

router.get("", checkPermissions("GET /roles"), getAllRolesController);

export default router;
