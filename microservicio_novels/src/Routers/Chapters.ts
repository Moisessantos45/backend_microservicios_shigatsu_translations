import { Router } from "express";
import { getChapter } from "../Controllers/ControllerGetChapter";

const router = Router();

//router es para solicitar los capitulos de una novela
router.get("/chapter/:novelId/:vol/:capitulo", getChapter);

export default router;
