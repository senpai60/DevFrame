import { USER_ERRORS } from "./user.constants.js";
import * as userRepository from "./user.repository.js";
import { ApiError } from "../../utils/ApiError.js";

export const findUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, USER_ERRORS.USER_NOT_FOUND);
    }
    return user;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, err.message || err);
  }
};

export const updateUserProfile = async (id, profileData) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, USER_ERRORS.USER_NOT_FOUND);
    }

    // If username is changing, ensure new username is not already taken
    if (profileData.username && profileData.username !== user.username) {
      const existingUser = await userRepository.findUserByUsername(profileData.username);
      if (existingUser && existingUser._id.toString() !== id.toString()) {
        throw new ApiError(400, USER_ERRORS.USER_ALREADY_EXISTS);
      }
    }

    // Prepare fields to update
    const updateFields = {};
    const allowedFields = ["name", "username", "bio", "headline", "location", "website", "skills", "socialLinks"];
    
    allowedFields.forEach((field) => {
      if (profileData[field] !== undefined) {
        if (field === "socialLinks") {
          // Merge social links or overwrite them safely
          const currentSocial = user.socialLinks ? user.socialLinks.toObject() : {};
          updateFields.socialLinks = {
            ...currentSocial,
            ...profileData.socialLinks
          };
        } else {
          updateFields[field] = profileData[field];
        }
      }
    });

    const updatedUser = await userRepository.updateUser(id, updateFields);
    return updatedUser;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, err.message || err);
  }
};

export const updateUserAvatar = async (id, avatarUrl) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new ApiError(404, USER_ERRORS.USER_NOT_FOUND);
    }

    const updatedUser = await userRepository.updateUser(id, { avatar: avatarUrl });
    return updatedUser;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, err.message || err);
  }
};

export const getUserByUsername = async (username) => {
  try {
    const user = await userRepository.findUserByUsername(username);
    if (!user) {
      throw new ApiError(404, USER_ERRORS.USER_NOT_FOUND);
    }
    
    // Convert to object and delete sensitive properties
    const userObj = user.toObject();
    delete userObj.refreshToken;
    delete userObj.email; // public profile doesn't expose email or refreshToken

    return userObj;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(500, err.message || err);
  }
};
