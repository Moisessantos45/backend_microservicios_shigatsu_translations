import { verify, JwtPayload, VerifyOptions } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const secretKey = process.env.SECRET_KEY;
interface TypesJwt extends JwtPayload {
  idToken: string;
}

class Jwt {
  // Sobrecarga de funciones
  static verify(token: string, secretKey: string): Promise<TypesJwt>;
  static verify(
    token: string,
    secretKey: string,
    options: VerifyOptions
  ): Promise<TypesJwt>;
  static verify(
    token: string,
    secretKey: string,
    options?: VerifyOptions
  ): Promise<TypesJwt> {
    return new Promise<TypesJwt>((resolve, reject) => {
      verify(token, secretKey, options, (err, decoded) => {
        if (err) {
          reject(new Error("Token no válido"));
        } else {
          // Verificamos que el decoded es del tipo esperado
          if (decoded && typeof decoded === "object" && "idToken" in decoded) {
            resolve(decoded as TypesJwt);
          } else {
            reject(
              new Error("El token decodificado no tiene el formato esperado")
            );
          }
        }
      });
    });
  }
}

const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(403)
      .json({ msg: "Token inexistente o formato inválido" });
  }

  const token = authHeader.split(" ")[1];

  if (!secretKey) {
    return res.status(500).json({
      msg: "Error de configuración del servidor: clave secreta no definida",
    });
  }

  try {
    // Verifica el token usando una promesa
    const options: VerifyOptions = { algorithms: ["HS256"] };
    const decodedToken = await Jwt.verify(token, secretKey, options);

    // Si la verificación es exitosa, agrega el userId al objeto req.query
    req.query.idToken = decodedToken.idToken;
    return next(); // Llama a next() para pasar al siguiente middleware
  } catch (error) {
    const errores = new Error("Token no valido");
    return res.status(404).json({ msg: errores.message }); // Usar return para salir del middleware
  }
};

export default verifySession;
