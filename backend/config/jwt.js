import jwt from "jwt";
import { ENV_CONFIG } from "./env.config";





export const generateAccessToken = (userId, expiresIn) => {
  return jwt.sign(userId, ENV_CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: `${expiresIn}day`,
  });
};
export const generateRefreshToken = (userId, expiresIn) => {
  return jwt.sign(userId, ENV_CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn: `${expiresIn}day`,
  });
};


