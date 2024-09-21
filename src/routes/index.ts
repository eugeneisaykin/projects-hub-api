import { authenticateToken } from "@/middleware/auth";
import express from "express";
import roles from "./roles";
import statuses from "./statuses";
import users from "./users";

const router = express.Router();

router.use(authenticateToken);
router.use("/users", users);
router.use("/roles", roles);
router.use("/statuses", statuses);

export default router;
