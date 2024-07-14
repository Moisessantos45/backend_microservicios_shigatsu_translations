import Jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

const generateToken = (idToken: string): string => {
  if (!secretKey) {
    throw new Error("Secret key not found");
  }
  return Jwt.sign({ idToken }, secretKey, {
    expiresIn: "15m",
    algorithm: "HS256",
  });
};

export default generateToken;
