import { Router } from "express";
import {
  addVolumen,
  deleteVolumen,
  getVolumenes,
  getVolumenesContent,
  updateVolumen,
} from "../Controllers/ControllerVolumenes";
import verifySession from "../Middleware/VerifySession";

const router = Router();

//router modificar los datos de los volumenes
router
  .route("/volumenes/:volumenId")
  .get(getVolumenes)
  .post(addVolumen)
  .put(updateVolumen)
  .delete(deleteVolumen);

router.get("/volumenes", verifySession, getVolumenesContent);
export default router;
