import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const salt = 10;
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePassword = async (
  password: string,
  encryptedData: string
) => {
  return bcrypt.compare(password, encryptedData);
};
