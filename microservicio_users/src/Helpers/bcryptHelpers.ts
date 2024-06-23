import bcrypt from "bcrypt";

const encryptarPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const comparePassword = async (
  passwordReq: string,
  passwordDb: string
): Promise<boolean> => {
  return await bcrypt.compare(passwordReq, passwordDb);
};

export { encryptarPassword, comparePassword };
