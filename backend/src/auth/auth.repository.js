/**
 * Auth Repository
 *
 * Typically, authentication delegates to the user repository for fetching/creating users.
 * You would use this file if you need to store authentication-specific data in the DB,
 * such as refresh tokens, session data, or password reset tokens.
 */

// export const saveRefreshToken = async (tokenData) => { ... }

import User from "../users/user.model.js";

export const saveRefreshToken = async (userId, refreshToken) => {
  return await User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
};

export const removeRefreshToken = async (userId) => {
  return await User.findByIdAndUpdate(userId, { refreshToken: null });
};

export const findByRefreshToken = async (refreshToken) => {
  return await User.findOne({ refreshToken });
};
