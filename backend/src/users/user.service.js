import { USER_ERRORS } from "./user.constants.js";
import * as userRepository from "./user.repository.js";

export const findUserById = async (id) => {
  try {
    const user = await userRepository.findUserById(id);
    if (!user) throw new Error(USER_ERRORS.USER_NOT_FOUND);
    return user;
  } catch (err) {
    throw new Error(err.message || err);
  }
};
