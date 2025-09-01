//lib/jwt.ts

import jwt, { SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signToken = (
  payload: object,
  expiresIn: StringValue | number = "1d" as StringValue
) => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
