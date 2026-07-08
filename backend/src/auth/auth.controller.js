import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../config/jwt.js";
import * as authRepository from "./auth.repository.js";
import { JWT_EXPIRES_IN, COOKIE_NAME, AUTH_ERRORS } from "./auth.constants.js";
import { ENV_CONFIG } from "../../config/env.config.js";
import { findOrCreateGithubUser } from "./auth.service.js";

export const githubCallback = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${ENV_CONFIG.ALLOWED_ORIGINS[0]}/login?error=Authentication_failed`,
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, "15m");
    const refreshToken = generateRefreshToken(user._id, JWT_EXPIRES_IN);

    // Save refresh token to database
    await authRepository.saveRefreshToken(user._id, refreshToken);

    // Set refresh token as an HttpOnly cookie
    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Redirect to frontend with access token
    res.redirect(
      `${ENV_CONFIG.ALLOWED_ORIGINS[0]}/dashboard?token=${accessToken}`,
    );
  } catch (error) {
    next(error);
  }
};

export const mockLogin = async (req, res, next) => {
  try {
    const mockProfile = {
      username: "mockoctocat",
      displayName: "Mock Octocat",
      emails: [{ value: "mockoctocat@devframe.com" }],
      photos: [{ value: "https://avatars.githubusercontent.com/u/583231?v=4" }],
    };

    // Pass the mock profile to the service layer to find or create the user in the DB
    const user = await findOrCreateGithubUser(mockProfile);

    // Generate tokens
    const accessToken = generateAccessToken(user._id, "15m");
    const refreshToken = generateRefreshToken(user._id, JWT_EXPIRES_IN);

    // Save refresh token to database
    await authRepository.saveRefreshToken(user._id, refreshToken);

    // Set refresh token as an HttpOnly cookie
    res.cookie(COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    // Redirect to frontend with access token
    res.redirect(
      `${ENV_CONFIG.ALLOWED_ORIGINS[0]}/dashboard?token=${accessToken}`,
    );
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

export const refreshTokens = async (req, res, next) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ message: AUTH_ERRORS.UNAUTHORIZED });
    }

    const decoded = verifyToken(refreshToken, ENV_CONFIG.REFRESH_TOKEN_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: AUTH_ERRORS.INVALID_TOKEN });
    }

    const userRecord = await authRepository.findByRefreshToken(refreshToken);
    if (!userRecord) {
      return res.status(401).json({ message: AUTH_ERRORS.INVALID_TOKEN });
    }

    const newAccessToken = generateAccessToken(userRecord._id, "15m");
    const newRefreshToken = generateRefreshToken(
      userRecord._id,
      JWT_EXPIRES_IN,
    );

    await authRepository.saveRefreshToken(userRecord._id, newRefreshToken);

    res.cookie(COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies[COOKIE_NAME];
    if (refreshToken) {
      const decoded = verifyToken(
        refreshToken,
        ENV_CONFIG.REFRESH_TOKEN_SECRET,
      );
      if (decoded) {
        await authRepository.removeRefreshToken(decoded.id);
      }
    }

    res.clearCookie(COOKIE_NAME);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
