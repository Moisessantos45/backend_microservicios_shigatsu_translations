import dbFirebase from "../Config/Db";
import { Request, Response } from "express";
import { novelDataWithoutVolumenes } from "../Types/types";
import errorHandle from "../Service/errorHandle";

const getHomePageContent = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const dataHome = await dbFirebase.collection("novelasData").get()
    
    if (dataHome.empty) {
      res.status(404).json({ msg: "No se encontraron datos" });
      return;
    }
    const newDataHome: novelDataWithoutVolumenes[] = dataHome.docs.map(
      (doc) => {
        const {
          volumenesActuales,
          nombresAlternos,
          background,
          generos,
          autor,
          ilustracionesAtuales,
          personajes,
          ...res
        } = doc.data();
        return { id: doc.id, ...res } as novelDataWithoutVolumenes;
      }
    );
    res.status(200).json(newDataHome);
  } catch (error) {
    errorHandle(error, res);
  }
};

export { getHomePageContent };
