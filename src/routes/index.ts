import authenticateToken from "@/middleware/auth";
import express from "express";
import roles from "./roles";
import users from "./users";

const router = express.Router();

router.use(authenticateToken);
router.use("/users", users);
router.use("/roles", roles);

export default router;
