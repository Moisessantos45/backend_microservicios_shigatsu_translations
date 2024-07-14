import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import { chapterData, volumenData } from "../Types/types";
import errorHandle from "../Service/errorHandle";

const getNovel = async (req: Request, res: Response): Promise<void> => {
  const { novelId } = req.params;
  try {
    const novel = await dbFirebase.collection("novelasData").doc(novelId).get();

    if (!novel.exists) {
      res.status(404).json({ message: "No se encontró la novela" });
      return;
    }
    const dataNovel = novel.data();
    const id = novel.id;

    const newNovel = { id, ...dataNovel };
    res.status(200).json(newNovel);
  } catch (error) {
    errorHandle(error, res);
  }
};

const getVolumenesNovel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { novelId } = req.params;
    const volumenes = await dbFirebase
      .collection("volumenesNovela")
      .where("novelId", "==", novelId)
      .get();

    if (volumenes.empty) {
      res.status(404).json({ msg: "No se encontraron volumenes" });
      return;
    }
    const newVolumene = volumenes.docs.map((item) => {
      const { ...rest } = item.data();
      return { volumenId: item.id, id: item.id, ...rest } as volumenData;
    });

    const newVolumenes: volumenData[] = newVolumene.sort(
      (a, b) => a.volumen - b.volumen
    );

    res.status(200).json(newVolumenes);
  } catch (error) {
    errorHandle(error, res);
  }
};

const getChaptersNovel = async (req: Request, res: Response): Promise<void> => {
  const { novelId } = req.params;
  try {
    const chapters = await dbFirebase
      .collection("chaptersNovels")
      .where("novelId", "==", novelId)
      .get();

    if (chapters.empty) {
      res.status(404).json({ message: "No se encontraron capitulos" });
      return;
    }
    const newChapters: chapterData[] = chapters.docs.map((item) => {
      const { createdAt, ...rest } = item.data();
      return { id: item.id, ...rest } as chapterData;
    });
    res.status(200).json(newChapters);
  } catch (error) {
    errorHandle(error, res);
  }
};

const getIlustracionesSite = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [getIlustracionesNovel, getIlustracionesSiteVolumen] =
      await Promise.all([
        dbFirebase.collection("novelasData").get(),
        dbFirebase.collection("volumenesNovela").get(),
      ]);

    if (getIlustracionesNovel.empty && getIlustracionesSiteVolumen.empty) {
      res.status(200).json({ msg: "No hay ilustraciones registradas" });
      return;
    }
    const ilustracionesSite = await Promise.all([
      getIlustracionesNovel.docs.map((doc) => {
        const { background, portada, ilustracionesAtuales = "" } = doc.data();
        const ilustracionesAtualesSplit = ilustracionesAtuales.split(",");
        return [background, portada, ...ilustracionesAtualesSplit];
      }),
      getIlustracionesSiteVolumen.docs.map((doc) => {
        const { portadaVolumen = "" } = doc.data();
        return [portadaVolumen];
      }),
    ]);
    res.status(200).json(ilustracionesSite.flat(2));
  } catch (error) {
    errorHandle(error, res);
  }
};

export { getNovel, getVolumenesNovel, getChaptersNovel, getIlustracionesSite };
