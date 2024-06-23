import Jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      Jwt.verify(token, process.env.SECRET_KEY as string);
      return next(); // Usar return para salir del middleware
    } catch (error) {
      const errores = new Error("Token no valido");
      return res.status(404).json({ msg: errores.message }); // Usar return para salir del middleware
    }
  }
  if (!token) {
    const error = new Error("Token inexistente");
    return res.status(403).json({ msg: error.message }); // Usar return para salir del middleware
  }
  // Eliminar el next() innecesario
};

export default verifySession;
