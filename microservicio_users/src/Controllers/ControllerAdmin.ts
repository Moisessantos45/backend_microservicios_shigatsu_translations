import { dbSupabase } from "../Config/db";
import { Request, Response } from "express";
import { encryptarPassword, comparePassword } from "../Helpers/bcryptHelpers";
import dotenv from "dotenv";
import generateToken from "../Helpers/generateToken";
import { UserWithoutPassword, userData, siteConfig } from "../Types/types";
import totp from "../Helpers/ValidateOTPAUTH";

dotenv.config();

const loginHandler = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, password } = req.body;

  try {
    const { data, error } = await dbSupabase
      .from("users")
      .select("*")
      .eq("userEmail", userEmail)
      .limit(1)
      .single();

    if (error) {
      res.status(300).json({ msg: "Usuario no valido" });
      return;
    }

    const docs: userData = data;
    const checkPasswordHas = await comparePassword(password, docs.password);
    if (!checkPasswordHas) {
      res.status(400).json({ msg: "La contraseña es incorrecta" });
      return;
    }
    if (docs.userActive === true) {
      await dbSupabase
        .from("users")
        .update({ userActive: false, token: "" })
        .eq("idUser", docs.idUser);
    }

    const id: string = docs.idUser;
    const checkStatus = docs.userStatus;
    if (!checkStatus) {
      res.status(400).json({ msg: "No tienes acceso" });
      return;
    }
    const check2fa = docs.has_2fa;
    const token: string = generateToken(id).trim();

    const userActive: boolean = check2fa ? false : true;
    await dbSupabase
      .from("users")
      .update({ token, userActive })
      .eq("id", docs.id);

    const { password: _, ...dataUser } = docs;
    dataUser.token = token;
    dataUser.userActive = userActive;
    res.status(200).json(dataUser);
  } catch (error) {
    res.status(500).json({ msg: "Ocurrion un error al iniciar sesion" });
  }
};

const login2faHandler = async (req: Request, res: Response): Promise<void> => {
  const { code2fa } = req.body;
  const { idUser } = req.params;
  const token: string = `${code2fa}`;
  try {
    const verify2faAccess = totp.validate({ token, window: 1 });
    if (!verify2faAccess) {
      res.status(401).json({ msg: "El codigo 2fa es incorrecto" });
      return;
    }
    const { data, error } = await dbSupabase
      .from("users")
      .update({ userActive: true })
      .eq("idUser", idUser)
      .single();

    if (error || data === null) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }

    res.status(200).json({ msg: "Codigo 2fa correcto" });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error al iniciar sesion" });
  }
};

const logoutHandler = async (req: Request, res: Response): Promise<void> => {
  const { idParams } = req.params;
  try {
    const { error } = await dbSupabase
      .from("users")
      .select("*")
      .eq("idUser", idParams)
      .single();
    if (error) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }
    await dbSupabase
      .from("users")
      .update({ token: "", userActive: false })
      .eq("idUser", idParams);

    res.status(200).json({ msg: "Sesion cerrada correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error al cerrar sesion" });
  }
};

const panelAdminHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const idToken = req.query.idToken;
  try {
    const [getUsersById, getAllUsers] = await Promise.all([
      dbSupabase.from("users").select("*").eq("idUser", idToken).single(),
      dbSupabase.from("users").select("*", { count: "exact" }),
    ]);

    const totalUsers: Number = getAllUsers.count || 0;
    const newGetUsersById: userData = getUsersById.data;

    const { password: __, token: _, ...getUsersByIdData } = newGetUsersById;

    res.status(200).json({ getUsersByIdData, totalUsers });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const getUsersHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await dbSupabase.from("users").select("*");
    if (error) {
      res.status(200).json({ msg: "No hay usuarios registrados" });
      return;
    }
    const users: UserWithoutPassword[] = data.map((doc) => {
      const { password, token, ...userData } = doc;
      return { ...userData };
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const addUserHandler = async (req: Request, res: Response): Promise<void> => {
  const { userEmail, password, userName, userType, profilePicture } = req.body;
  const userStatus: boolean = true;
  const userActive: boolean = false;
  const token: string = "";
  try {
    const { error } = await dbSupabase
      .from("users")
      .select("*")
      .eq("userEmail", userEmail)
      .single();

    if (error) {
      res.status(400).json({ msg: "El usuario ya esta registrado" });
      return;
    }
    const passwordHas = await encryptarPassword(password);

    await dbSupabase.from("users").insert({
      userEmail,
      password: passwordHas,
      userName,
      userType,
      profilePicture,
      userStatus,
      userActive,
      token,
      has_2fa: false,
      is_first_login: true,
    });

    res.status(200).json({ msg: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const updateUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idUser } = req.params;
  try {
    const { data, error } = await dbSupabase
      .from("users")
      .select("*")
      .eq("idUser", idUser)
      .single();
    if (error) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }
    const newdataUser = data || {};
    const dataUserReq = req.body;
    let verifyDataUpdate: boolean = false;
    for (const key in dataUserReq) {
      if (dataUserReq[key] !== newdataUser[key]) {
        verifyDataUpdate = true;
        if (key === "password") {
          if (dataUserReq[key].trim() !== "") {
            const passwordHas = await encryptarPassword(dataUserReq[key]);
            newdataUser[key] = passwordHas;
          }
        } else if (
          key === "userActive" ||
          key === "userStatus" ||
          key === "has_2fa" ||
          key === "is_first_login"
        ) {
          newdataUser[key] = JSON.parse(dataUserReq[key]);
        } else {
          newdataUser[key] = dataUserReq[key];
        }
      }
    }
    if (!verifyDataUpdate) {
      res.status(200).json({ msg: "No hay datos para actualizar" });
      return;
    }

    await dbSupabase.from("users").update(newdataUser).eq("idUser", idUser);
    const { password, token, ...newDataUser } = newdataUser;
    res.status(200).json(newDataUser);
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const updateUserStatusHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idUser } = req.params;
  try {
    const { data, error } = await dbSupabase
      .from("users")
      .select("*")
      .eq("idUser", idUser)
      .single();
    if (error) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }
    const newdataUser: userData = data;

    await dbSupabase
      .from("users")
      .update({ userStatus: !newdataUser.userStatus })
      .eq("idUser", idUser);

    res.status(200).json({ msg: "Usuario actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const deleteUserHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idUser } = req.params;
  try {
    const { error } = await dbSupabase
      .from("users")
      .select("*")
      .eq("idUser", idUser)
      .single();

    if (error) {
      res.status(400).json({ msg: "El usuario no existe" });
      return;
    }
    await dbSupabase.from("users").delete().eq("idUser", idUser);
    res.status(200).json({ msg: "Usuario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const getConfigHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data, error } = await dbSupabase
      .from("ConfigSite")
      .select("*")
      .single();

    if (error) {
      res.status(200).json({ msg: "No hay configuracion registrada" });
      return;
    }
    const newConfigData: siteConfig[] = data;
    res.status(200).json(newConfigData);
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const updateConfigHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { data, error } = await dbSupabase
      .from("ConfigSite")
      .select("*")
      .single();

    if (error) {
      res.status(200).json({ msg: "No hay configuracion registrada" });
      return;
    }
    const newConfigData = data;
    const dataConfigReq = req.body;
    let verifyDataUpdate: boolean = false;

    for (const key in dataConfigReq) {
      if (dataConfigReq[key] !== newConfigData[key]) {
        newConfigData[key] = dataConfigReq[key];
        verifyDataUpdate = true;
      }
    }
    if (!verifyDataUpdate) {
      res.status(200).json({ msg: "No hay datos para actualizar" });
      return;
    }
    await dbSupabase
      .from("ConfigSite")
      .update(newConfigData)
      .eq("id", newConfigData.id);

    res.status(200).json(newConfigData);
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

const changesStatusSite = async (req: Request, res: Response) => {
  const status = req.query.status;
  try {
    const validateStatus = ["true", "false"].find((item) => item === status);
    if (!validateStatus) {
      res.status(400).json({ msg: "El estado no es valido" });
      return;
    }
    const { data, error } = await dbSupabase
      .from("ConfigSite")
      .update({ isMaintenanceMode: JSON.parse(validateStatus) })
      .select("id");

    if (error || data === null) {
      res.status(400).json({ msg: "No hay configuracion registrada" });
      return;
    }

    res.status(200).json({ msg: "Estado actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Ocurrio un error en la solicitud" });
  }
};

export {
  loginHandler,
  logoutHandler,
  panelAdminHandler,
  getUsersHandler,
  addUserHandler,
  updateUserHandler,
  updateUserStatusHandler,
  deleteUserHandler,
  getConfigHandler,
  updateConfigHandler,
  login2faHandler,
  changesStatusSite,
};
