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
    const cantidadVolumenes: number = getChapterNovelVol.docs.length;
    const newChapter = chapter.docs.map((item) => {
      const { contenido, nombreCapitulo,capitulo } = item.data();
      return { contenido, nombreCapitulo,capitulo };
    });
    res.status(200).json({ newChapter, cantidadVolumenes });
  } catch (error) {
    errorHandle(error, res);
  }
};

export { getChapter };
