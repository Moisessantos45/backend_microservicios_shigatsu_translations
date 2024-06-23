import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import { novelData } from "../Types/types";
import { parseStatus } from "../Utils/utils";
import { v4 as uuidv4 } from "uuid";
import errorHandle from "../Service/errorHandle";

const getNovels = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dataNovels = await dbFirebase.collection("novelasData").get();
    const novels: novelData[] = dataNovels.docs.map((item) => {
      const { ...rest } = item.data();
      return { id: item.id, idNovel: item.id, ...rest } as novelData;
    });
    res.status(200).json(novels);
  } catch (error) {
    errorHandle(error, res);
  }
};

const addNovels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { statusNovel, volumenesActuales, ...rest } = req.body;
    const dataReq: novelData = {
      ...rest,
      novelId: uuidv4(),
      volumenesActuales: parseInt(volumenesActuales),
      statusNovel: parseStatus(req.body.statusNovel),
    };
    await dbFirebase.collection("novelasData").add(dataReq);
    res.status(201).json(dataReq);
  } catch (error) {
    errorHandle(error, res);
  }
};

const insertNovelData = async (req: Request, res: Response): Promise<void> => {
  const novelRef = dbFirebase.collection("novelasData").doc();
  try {
    await dbFirebase.runTransaction(async (transction) => {
      const verifyData = await transction.get(
        dbFirebase
          .collection("novelasData")
          .where("nombreNovela", "==", req.body.nombreNovela)
      );

      if (!verifyData.empty) {
        throw new Error("La novela ya existe");
      }
      const { statusNovel, volumenesActuales, ...rest } = req.body;

      const newNovelData: novelData = {
        ...rest,
        novelId: uuidv4(),
        volumenesActuales: parseInt(volumenesActuales),
        statusNovel: parseStatus(req.body.statusNovel),
      };

      transction.set(novelRef, newNovelData);

      res.status(200).json(newNovelData);
    });
  } catch (error) {
    errorHandle(error, res);
  }
};

const updateNovels = async (req: Request, res: Response): Promise<void> => {
  const { idNovel } = req.params;
  try {
    const novel = await dbFirebase.collection("novelasData").doc(idNovel).get();

    if (!novel.exists) {
      res.status(404).json({ msg: "Novela no encontrada" });
      return;
    }
    const newDataNovel = novel.data() || {};
    const { idNovel: _, ...dataNovel } = req.body;
    let verifyDataUpdates: boolean = false;
    for (const key in dataNovel) {
      if (newDataNovel[key] !== dataNovel[key]) {
        verifyDataUpdates = true;
        if (key === "statusNovel") {
          newDataNovel[key] = parseStatus(dataNovel[key]);
        } else {
          newDataNovel[key] = dataNovel[key];
        }
      }
    }
    if (!verifyDataUpdates) {
      res.status(400).json({ msg: "No hay datos para actualizar" });
      return;
    }

    await dbFirebase
      .collection("novelasData")
      .doc(idNovel)
      .update(newDataNovel);

    res.status(200).json({ msg: "Novela actualizada" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const updateNovelStatusHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idNovel } = req.params;
  const status: string = req.query.status as string;
  try {
    const novelId = await dbFirebase
      .collection("novelasData")
      .doc(idNovel)
      .get();

    if (!novelId.exists) {
      res.status(403).json({ msg: "Novela no encontrada" });
      return;
    }

    await dbFirebase
      .collection("novelasData")
      .doc(idNovel)
      .update({ statusNovel: parseStatus(status) });

    res.status(200).json({ msg: "Status Actualizado" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const handleNovelStatusUpdate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { idNovel } = req.params;
  const status: string = req.query.status as string;
  const novelRef = dbFirebase.collection("novelasData").doc(idNovel);
  try {
    await dbFirebase.runTransaction(async (transction) => {
      const novelId = await transction.get(novelRef);

      if (!novelId.exists) {
        throw new Error("Novela no encontrada");
      }

      novelRef.update({ statusNovel: parseStatus(status) });
    });

    res.status(200).json({ msg: "Status Actualizado" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const deleteNovels = async (req: Request, res: Response): Promise<void> => {
  const { idNovel } = req.params;
  try {
    await dbFirebase.collection("novelasData").doc(idNovel).delete();
    res.status(200).json({ msg: "Novela eliminada" });
  } catch (error) {
    errorHandle(error, res);
  }
};

export {
  getNovels,
  addNovels,
  insertNovelData,
  updateNovels,
  updateNovelStatusHandler,
  handleNovelStatusUpdate,
  deleteNovels,
};
