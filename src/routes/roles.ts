import { getAllRolesController } from "@/controllers/roles.controller";
import express from "express";

const router = express.Router();

router.get("", getAllRolesController);

export default router;
