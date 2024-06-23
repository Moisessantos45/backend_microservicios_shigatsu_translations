import Jwt from "jsonwebtoken";

const generateToken = (idToken: string): string => {
  return Jwt.sign({ idToken }, process.env.SECRET_KEY as string, {
    expiresIn: "15d",
  });
};

export default generateToken;
