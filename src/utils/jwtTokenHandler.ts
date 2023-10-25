import jwt from "jsonwebtoken";

export const createToken = (payload: string | object, expiresIn: string) => {
  const secret = process.env.SECRET_KEY;
  return jwt.sign({ payload }, secret, { expiresIn: expiresIn });
};