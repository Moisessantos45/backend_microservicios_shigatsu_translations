import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import { obtenerFecha } from "../Utils/utils";
import { chapterDataWithoutContentChapter } from "../Types/types";
import errorHandle from "../Service/errorHandle";

const getChaptersDb = async (_req: Request, res: Response): Promise<void> => {
  try {
    const newChapters = await dbFirebase.collection("chaptersNovels").get();
    if (newChapters.empty) {
      res.status(404).json({ msg: "No se encontraron datos" });
      return;
    }
    const newChaptersData = newChapters.docs.map((doc) => ({
      capituloId: doc.id,
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(newChaptersData);
  } catch (error) {
    errorHandle(error, res);
  }
};

const getChaptersContentDb = async (_req: Request, res: Response) => {
  try {
    const { docs, empty } = await dbFirebase.collection("chaptersNovels").get();
    if (empty) {
      res.status(404).json({ msg: "No se encontraron datos" });
      return;
    }
    const newChaptersData: chapterDataWithoutContentChapter[] = docs
      .map((doc) => {
        const { contenido, capitulo, nombreCapitulo, ...rest } = doc.data();
        return {
          capituloId: doc.id,
          ...rest,
        } as chapterDataWithoutContentChapter;
      })
      .slice(0, 10);
    res.status(200).json(newChaptersData);
  } catch (error) {
    errorHandle(error, res);
  }
};

const addChapterDb = async (req: Request, res: Response): Promise<void> => {
  try {
    const verifyExist = await dbFirebase
      .collection("chaptersNovels")
      .where("capitulo", "==", +req.body.capitulo)
      .where("nombreNovela", "==", req.body.nombreNovela)
      .where("volumenPertenece", "==", +req.body.volumenPertenece)
      .get();
    if (!verifyExist.empty) {
      res.status(400).json({ msg: "El capitulo ya existe" });
      return;
    }
    const { capitulo, ...rest } = req.body;
    const newChapter = {
      ...rest,
      createdAt: obtenerFecha(),
      capitulo: +capitulo,
    };
    await dbFirebase.collection("chaptersNovels").add(newChapter);
    res.status(200).json(newChapter);
  } catch (error) {
    errorHandle(error, res);
  }
};

const addChapterTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const chapterRef = dbFirebase.collection("chaptersNovels").doc();
  try {
    await dbFirebase.runTransaction(async (transaction) => {
      const verifyExist = await transaction.get(
        dbFirebase
          .collection("chaptersNovels")
          .where("capitulo", "==", +req.body.capitulo)
          .where("nombreNovela", "==", req.body.nombreNovela)
          .where("volumenPertenece", "==", +req.body.volumenPertenece)
      );
      if (!verifyExist.empty) {
        throw new Error("El capitulo ya existe");
      }

      const { capitulo, ...rest } = req.body;
      const newChapter = {
        ...rest,
        createdAt: obtenerFecha(),
        capitulo: +capitulo,
      };

      transaction.set(chapterRef, newChapter);

      res.status(200).json(newChapter);
    });
  } catch (error) {
    errorHandle(error, res);
  }
};

const updateChapterDb = async (req: Request, res: Response): Promise<void> => {
  const { capituloId } = req.params;
  try {
    const verifyExist = await dbFirebase
      .collection("chaptersNovels")
      .doc(capituloId)
      .get();
    if (!verifyExist.exists) {
      res.status(404).json({ msg: "El capitulo no existe" });
      return;
    }
    const newChapter = verifyExist.data() || {};
    const { capituloId: _, ...dataChapter } = req.body;
    let verifyDataUpdates: boolean = false;
    for (const key in dataChapter) {
      if (dataChapter[key] !== newChapter[key]) {
        verifyDataUpdates = true;
        if (
          key === "capitulo" ||
          key === "volumenPertenece" ||
          key === "createdAt" ||
          key === "createdAt"
        ) {
          newChapter[key] = +dataChapter[key];
        } else {
          newChapter[key] = dataChapter[key];
        }
      }
    }
    if (!verifyDataUpdates) {
      res.status(200).json({ msg: "No hay datos para actualizar" });
      return;
    }
    await dbFirebase
      .collection("chaptersNovels")
      .doc(capituloId)
      .update(newChapter);
    res.status(200).json({ msg: "Datos actualizados correctamente" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const deleteChapterDb = async (req: Request, res: Response): Promise<void> => {
  const { capituloId } = req.params;
  try {
    await dbFirebase.collection("chaptersNovels").doc(capituloId).delete();
    res.status(200).json({ msg: "Datos eliminados correctamente" });
  } catch (error) {
    errorHandle(error, res);
  }
};

export {
  getChaptersDb,
  getChaptersContentDb,
  addChapterDb,
  addChapterTransaction,
  updateChapterDb,
  deleteChapterDb,
};
