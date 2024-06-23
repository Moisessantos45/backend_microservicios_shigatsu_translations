import { Router } from "express";
import {
  addUserHandler,
  deleteUserHandler,
  getConfigHandler,
  getUsersHandler,
  login2faHandler,
  loginHandler,
  logoutHandler,
  panelAdminHandler,
  updateConfigHandler,
  updateUserHandler,
  updateUserStatusHandler,
} from "../Controllers/ControllerAdmin";
import verifySession from "../Middleware/VerifySession";

const router = Router();

//routes para solicitar acceso a la API
router.post("/login", loginHandler);
router.post("/logout/:idParams", logoutHandler);
//router para solicitar el codigo de verificacion
router.post("/verification/:idUser", login2faHandler);

//routes para manejar el panel de administración
router.get("/PanelAdmin", verifySession, panelAdminHandler);
router.get("/PanelAdmin/getUsers", verifySession, getUsersHandler);
router.post("/PanelAdmin/addUser", verifySession, addUserHandler);
router.put("/PanelAdmin/updateUser/:idUser", updateUserHandler);
router.put("/PanelAdmin/RenewPassword/:idUser");
router.patch("/PanelAdmin/StatusUser/:idUser", updateUserStatusHandler);
router.delete(
  "/PanelAdmin/deleteUser/:idUser",
  verifySession,
  deleteUserHandler
);

//routes para configuracion de la web
router
  .route("/PanelAdmin/getConfig")
  .get(getConfigHandler)
  .put(updateConfigHandler);

export default router;
