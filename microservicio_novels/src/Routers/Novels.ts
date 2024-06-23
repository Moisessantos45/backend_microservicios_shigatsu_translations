import { Router } from "express";
import {
  addNovels,
  deleteNovels,
  getNovels,
  updateNovelStatusHandler,
  updateNovels,
} from "../Controllers/ControllerNovelas";

const router = Router();

router
  .route("/addNovels/:idNovel")
  .get(getNovels)
  .post(addNovels)
  .put(updateNovels)
  .patch(updateNovelStatusHandler)
  .delete(deleteNovels);

export default router;
