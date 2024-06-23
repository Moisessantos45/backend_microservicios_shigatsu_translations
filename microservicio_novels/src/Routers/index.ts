import fs from "fs";
import { Router } from "express";

const router = Router();
const path = `${__dirname}`;

const eliminarExtension = (fileName: string): string => {
  return fileName.split(".").shift() || "";
};

const routesDinamicos = async () => {
  const files = fs.readdirSync(path).filter((file) => {
    const fileWithOutExtension = eliminarExtension(file);
    const verfyFileNameOmitIndex = ["index"].includes(fileWithOutExtension);
    return !verfyFileNameOmitIndex;
  });
  for (const file of files) {
    const fileWithOutExtension = eliminarExtension(file);
    const routePath = `/${fileWithOutExtension}`;
    const filePath = `./${fileWithOutExtension}`;

    const module = await import(filePath);
    router.use(routePath, module.default);
  }
};

routesDinamicos();

export default router;
