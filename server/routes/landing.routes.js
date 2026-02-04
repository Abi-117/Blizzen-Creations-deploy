import express from "express";
import {
  getLanding,
  saveLanding,
} from "../controllers/landing.controller.js";

const router = express.Router();

/* GET landing data */
router.get("/", getLanding);

/* POST landing data (ADMIN SAVE) */
router.post("/", saveLanding);

export default router;
