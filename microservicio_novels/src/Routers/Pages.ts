import { Router } from "express";
import {
  getChaptersNovel,
  getIlustracionesSite,
  getNovel,
  getVolumenesNovel,
} from "../Controllers/ControllerPages";

const router = Router();

//router para solicitar las info de una novela
router.get("/novel/:novelId", getNovel);
router.get("/volumen/:novelId", getVolumenesNovel);
router.get("/chapter/:novelId", getChaptersNovel);
router.get("/getImages", getIlustracionesSite);

export default router;
