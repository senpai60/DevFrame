import { verifyToken } from "../../config/jwt.js";
import { findUserById } from "../users/user.service.js";
import { AUTH_ERRORS } from "./auth.constants.js";
import { ENV_CONFIG } from "../../config/env.config.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: AUTH_ERRORS.UNAUTHORIZED });
    }

    const decoded = verifyToken(token, ENV_CONFIG.ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: AUTH_ERRORS.INVALID_TOKEN });
    }

    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: AUTH_ERRORS.USER_NOT_FOUND });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
