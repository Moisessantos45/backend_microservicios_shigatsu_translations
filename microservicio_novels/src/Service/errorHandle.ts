import { Response } from "express";

const errorHandle = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res.status(500).json({ msg: error.message });
    return;
  }
  res.status(500).json({ msg: "Error en el servidor" });
};

export default errorHandle;
