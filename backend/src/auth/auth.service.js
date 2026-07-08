import jwt from "jsonwebtoken";
// import { AUTH_ERRORS, JWT_EXPIRES_IN } from "./auth.constants.js";
import * as userRepository from "../users/user.repository.js";

export const findOrCreateGithubUser = async (profile) => {
  try {
    const { username, displayName, emails, photos } = profile;
    let email = emails && emails.length > 0 ? emails[0].value : null;

    if (!email) {
      email = `${username}@users.noreply.github.com`;
    }

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
    } else if (user.email.includes("noreply.github.com") && !email.includes("noreply.github.com")) {
      // If the user previously had a noreply email but we now have their real email, update it
      user = await userRepository.updateUser(user._id, { email });
    }

    return user;
  } catch (err) {
    throw new Error(err.message || err);
  }
};
