import { Router } from "express";
import { getHomePageContent } from "../Controllers/ControllerHome";

const router = Router();

//router para solicitar la pagina principal
router.get("/", getHomePageContent);

export default router;