import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import errorHandle from "../Service/errorHandle";

const getChapter = async (req: Request, res: Response): Promise<void> => {
  const { novelId, vol, capitulo } = req.params;
  try {
    const [chapter, getChapterNovelVol] = await Promise.all([
      dbFirebase
        .collection("chaptersNovels")
        .where("novelId", "==", novelId)
        .where("volumenPertenece", "==", parseInt(vol))
        .where("capitulo", "==", parseInt(capitulo))
        .limit(1)
        .get(),
      dbFirebase
        .collection("chaptersNovels")
        .where("novelId", "==", novelId)
        .where("volumenPertenece", "==", parseInt(vol))
        .get(),
    ]);

    if (chapter.empty) {
      res.status(404).json({ message: "No se encontró el capitulo" });
      return;
    }
    const {
      capituloId,
      createdAt,
      novelId: _,
      volumenPertenece,
      ...newChapter
    } = chapter.docs[0].data();

    const cantidadVolumenes: number = getChapterNovelVol.docs.length;

    res.status(200).json({ newChapter, cantidadVolumenes });
  } catch (error) {
    errorHandle(error, res);
  }
};

export { getChapter };
