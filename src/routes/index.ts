import authenticateToken from "@/middleware/auth";
import express from "express";
import users from "./users";

const router = express.Router();

router.use(authenticateToken);
router.use("/users", users);

export default router;
