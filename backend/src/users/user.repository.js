import User from "./user.model.js";

export const findUserById = async (id) => {
  return await User.findById(id);
};

export const findUserByGithubUsername = async (username) => {
  return await User.findOne({ githubUsername: username });
};

export const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

export const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};
