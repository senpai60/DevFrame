import jwt from "jsonwebtoken";
import { ENV_CONFIG } from "./env.config.js";

export const generateAccessToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, ENV_CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn,
  });
};

export const generateRefreshToken = (userId, expiresIn) => {
  return jwt.sign({ id: userId }, ENV_CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn,
  });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
