import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import { ENV_CONFIG } from "./env.config.js";
import { findUserById } from "../src/users/user.service.js";
import * as authService from "../src/auth/auth.service.js";

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Configure the Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ['user:email'],
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        // Pass the profile to the service layer to find or create the user in the DB
        const user = await authService.findOrCreateGithubUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

export default passport;
