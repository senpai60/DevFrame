import * as userService from "./user.service.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.user._id);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserAvatar(req.user._id, req.body.avatar);
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};
