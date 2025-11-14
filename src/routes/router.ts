import { Router } from "express";

// Controllers
import { getThumbCard, getBannerThumbCard } from "@/controllers";

const router = Router();

// Routes
router.route("/thumbcard/:id").get(getThumbCard);
router.route("/bannerthumbcard/:id").get(getBannerThumbCard);

export { router };
