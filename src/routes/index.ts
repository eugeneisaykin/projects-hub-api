import { authenticateToken } from "@/middleware/auth";
import express from "express";
import roles from "./roles";
import statuses from "./statuses";
import tasks from "./tasks";
import users from "./users";

const router = express.Router();

router.use(authenticateToken);
router.use("/users", users);
router.use("/roles", roles);
router.use("/statuses", statuses);
router.use("/tasks", tasks);

export default router;
