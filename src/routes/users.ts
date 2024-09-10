import { createUserController } from "@/controllers/users.controller";
import express from "express";

const router = express.Router();

router.post("/registration", createUserController);

export default router;
