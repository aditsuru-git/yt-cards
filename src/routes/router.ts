import { Router } from "express";

// Controllers
import { getThumbCard } from "../controllers/thumbCard.controller";

const router = Router();

// Routes
router.route("/thumbcard/:id").get(getThumbCard);

export { router };
