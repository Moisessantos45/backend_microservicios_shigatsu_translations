import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import { novelData } from "../Types/types";
import { parseStatus } from "../Utils/utils";
import { v4 as uuidv4 } from "uuid";
import errorHandle from "../Service/errorHandle";

const getNovels = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dataNovels = await dbFirebase.collection("novelasData").get();

    const novels = dataNovels.docs.map((item) => {
      const { ...rest } = item.data();
      return { id: item.id, ...rest };
    });

    res.status(200).json(novels);
  } catch (error) {
    errorHandle(error, res);
  }
};

const addNovels = async (req: Request, res: Response): Promise<void> => {
  try {
    const { empty } = await dbFirebase
      .collection("novelasData")
      .where("nombreNovela", "==", req.body.nombreNovela)
      .get();

    if (!empty) {
      res.status(400).json({ msg: "La novela ya existe" });
      return;
    }

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
  const { novelId } = req.params;
  try {
    const novel = await dbFirebase
      .collection("novelasData")
      .where("novelId", "==", novelId)
      .get();

    if (novel.empty) {
      res.status(404).json({ msg: "Novela no encontrada" });
      return;
    }

    const newDataNovel = novel.docs[0].data();
    const id = novel.docs[0].id;
    const { novelId: _, ...dataNovel } = req.body;
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

    await dbFirebase.collection("novelasData").doc(id).update(newDataNovel);

    res.status(200).json({ msg: "Novela actualizada" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const updateNovelStatusHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { novelId } = req.params;
  const status: string = req.query.status as string;
  try {
    const data = await dbFirebase
      .collection("novelasData")
      .where("novelId", "==", novelId)
      .get();

    if (data.empty) {
      res.status(403).json({ msg: "Novela no encontrada" });
      return;
    }
    const id = data.docs[0].id;

    await dbFirebase
      .collection("novelasData")
      .doc(id)
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
  const { novelId } = req.params;
  // const status: string = req.query.status as string;
  const novelRef = dbFirebase
    .collection("novelasData")
    .where("novelId", "==", novelId);
  try {
    await dbFirebase.runTransaction(async (transction) => {
      const novelId = await transction.get(novelRef);

      if (!novelId.empty) {
        throw new Error("Novela no encontrada");
      }
    });

    res.status(200).json({ msg: "Status Actualizado" });
  } catch (error) {
    errorHandle(error, res);
  }
};

const deleteNovels = async (req: Request, res: Response): Promise<void> => {
  const { novelId } = req.params;
  try {
    await dbFirebase.collection("novelasData").doc(novelId).delete();
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
