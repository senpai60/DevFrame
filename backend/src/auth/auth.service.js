import jwt from "jsonwebtoken";
// import { AUTH_ERRORS, JWT_EXPIRES_IN } from "./auth.constants.js";
import * as userRepository from "../users/user.repository.js";

export const findOrCreateGithubUser = async (profile) => {
  try {
    const { username, displayName, emails, photos } = profile;
    const email = emails && emails.length > 0 ? emails[0].value : null;

    let user = await userRepository.findUserByGithubUsername(username);

    if (!user) {
      if (!email) {
        throw new Error("Email is required from GitHub profile.");
      }

      user = await userRepository.createUser({
        name: displayName || username,
        username: username,
        githubUsername: username,
        email: email,
        avatar: photos && photos.length > 0 ? photos[0].value : "",
      });
    }

    return user;
  } catch (err) {
    throw new Error(err.message || err);
  }
};
