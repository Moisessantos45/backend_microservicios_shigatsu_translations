import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { volumenData } from "../Types/types";
import { arraysIguales, obtenerFecha } from "../Utils/utils";
import errorHandle from "../Service/errorHandle";

const getVolumenes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dataVolumen = await dbFirebase.collection("volumenesNovela").get();
    if (dataVolumen.empty) {
      res.status(404).json({ msg: "No se encontraron datos" });
      return;
    }

    const newVolumenes = dataVolumen.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(newVolumenes);
  } catch (error) {
    errorHandle(error, res);
  }
};

const getVolumenesContent = async (_req: Request, res: Response) => {
  try {
    const { docs, empty } = await dbFirebase
      .collection("volumenesNovela")
      .get();

    if (empty) {
      res.status(404).json({ msg: "No se encontraron datos" });
      return;
    }

    const newVolumenData = docs.map((doc) => {
      const { portadaVolumen, links, disponibilidad, ...res } = doc.data();
      return {
        id: doc.id,
        ...res,
      };
    });

    res.status(200).json(newVolumenData);
  } catch (error) {
    errorHandle(error, res);
  }
};

const addVolumen = async (req: Request, res: Response): Promise<void> => {
  const volumenRef = dbFirebase.collection("volumenesNovela").doc();
  try {
    dbFirebase.runTransaction(async (transction) => {
      const verifyExist = await transction.get(
        dbFirebase
          .collection("volumenesNovela")
          .where("novelId", "==", req.body.novelId)
          .where("volumen", "==", +req.body.volumen)
          .where("nombreNovela", "==", req.body.nombreNovela)
      );

      if (!verifyExist.empty) {
        throw new Error("El volumen ya existe");
      }

      const { volumen, ...rest } = req.body;
      const newVolumen: volumenData = {
        ...rest,
        volumenId: uuidv4(),
        createdAt: obtenerFecha(),
        volumen: +volumen,
      };

      transction.set(volumenRef, newVolumen);
      res.status(200).json(newVolumen);
    });
  } catch (error) {
    errorHandle(error, res);
  }
};

const updateVolumen = async (req: Request, res: Response): Promise<void> => {
  const { volumenId } = req.params;
  try {
    const verifyExist = await dbFirebase
      .collection("volumenesNovela")
      .where("volumenId", "==", volumenId)
      .get();

    if (verifyExist.empty) {
      res.status(404).json({ msg: "El volumen no existe" });
      return;
    }

    const newVolumen = verifyExist.docs[0].data();
    const id = verifyExist.docs[0].id;
    const { volumenId: _, id: __, createdAt, ...dataVolumen } = req.body;
    let verifyDataUpdates: boolean = false;
    for (const key in dataVolumen) {
      if (newVolumen[key] !== dataVolumen[key]) {
        verifyDataUpdates = true;
        if (key === "volumen" || key === "createdAt") {
          newVolumen[key] = +dataVolumen[key];
        } else {
          newVolumen[key] = dataVolumen[key];
        }
      }
      if (key === "links") {
        if (!arraysIguales(newVolumen[key], dataVolumen[key])) {
          newVolumen[key] = dataVolumen[key];
          verifyDataUpdates = true;
        }
      }
    }
    if (!verifyDataUpdates) {
      res.status(200).json({ msg: "No hay datos para actualizar" });
      return;
    }
    await dbFirebase.collection("volumenesNovela").doc(id).update(newVolumen);
    res.status(200).json({ msg: "Datos actualizados correctamente" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const deleteVolumen = async (req: Request, res: Response): Promise<void> => {
  const { volumenId } = req.params;
  try {
    await dbFirebase.collection("volumenesNovela").doc(volumenId).delete();
    res.status(200).json({ msg: "Datos eliminados correctamente" });
  } catch (error) {
    errorHandle(error, res);
  }
};

export {
  getVolumenes,
  getVolumenesContent,
  addVolumen,
  updateVolumen,
  deleteVolumen,
};
