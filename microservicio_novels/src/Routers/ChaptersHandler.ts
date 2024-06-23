import { Router } from "express";
import {
  addChapterTransaction,
  deleteChapterDb,
  getChaptersContentDb,
  getChaptersDb,
  updateChapterDb,
} from "../Controllers/ControllerChapters";
import verifySession from "../Middleware/VerifySession";

const router = Router();
// route es para modificar los datos de los capitulos
router
  .route("/chapters/:capituloId")
  .post(addChapterTransaction)
  .get(getChaptersDb)
  .put(updateChapterDb)
  .delete(deleteChapterDb);

router.get("/chapters", verifySession, getChaptersContentDb);

export default router;
