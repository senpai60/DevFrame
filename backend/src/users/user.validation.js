import { ApiError } from "../../utils/ApiError.js";
import { USER_CONSTANTS } from "./user.constants.js";

// Helper to check URL validity
const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export const validateProfileUpdate = (req, res, next) => {
  const errors = [];
  const { name, username, bio, headline, location, website, skills, socialLinks } = req.body;

  if (name !== undefined) {
    if (typeof name !== "string") {
      errors.push("Name must be a string.");
    } else if (name.trim().length > USER_CONSTANTS.MAX_NAME_LENGTH) {
      errors.push(`Name cannot exceed ${USER_CONSTANTS.MAX_NAME_LENGTH} characters.`);
    }
  }

  if (username !== undefined) {
    if (typeof username !== "string") {
      errors.push("Username must be a string.");
    } else {
      const trimmedUsername = username.trim();
      if (trimmedUsername.length > USER_CONSTANTS.MAX_USERNAME_LENGTH) {
        errors.push(`Username cannot exceed ${USER_CONSTANTS.MAX_USERNAME_LENGTH} characters.`);
      }
      // Alphanumeric, underscores, and hyphens only
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(trimmedUsername)) {
        errors.push("Username can only contain alphanumeric characters, underscores, and hyphens.");
      }
    }
  }

  if (bio !== undefined) {
    if (typeof bio !== "string") {
      errors.push("Bio must be a string.");
    } else if (bio.length > USER_CONSTANTS.MAX_BIO_LENGTH) {
      errors.push(`Bio cannot exceed ${USER_CONSTANTS.MAX_BIO_LENGTH} characters.`);
    }
  }

  if (headline !== undefined) {
    if (typeof headline !== "string") {
      errors.push("Headline must be a string.");
    } else if (headline.length > 100) {
      errors.push("Headline cannot exceed 100 characters.");
    }
  }

  if (location !== undefined) {
    if (typeof location !== "string") {
      errors.push("Location must be a string.");
    } else if (location.length > 100) {
      errors.push("Location cannot exceed 100 characters.");
    }
  }

  if (website !== undefined && website !== "") {
    if (typeof website !== "string" || !isValidUrl(website)) {
      errors.push("Website must be a valid URL.");
    }
  }

  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      errors.push("Skills must be an array of strings.");
    } else {
      if (skills.length > USER_CONSTANTS.MAX_SKILLS_COUNT) {
        errors.push(`Skills list cannot exceed ${USER_CONSTANTS.MAX_SKILLS_COUNT} items.`);
      }
      skills.forEach((skill, idx) => {
        if (typeof skill !== "string") {
          errors.push(`Skill at index ${idx} must be a string.`);
        }
      });
    }
  }

  if (socialLinks !== undefined) {
    if (typeof socialLinks !== "object" || socialLinks === null || Array.isArray(socialLinks)) {
      errors.push("socialLinks must be an object.");
    } else {
      const allowedPlatforms = ["github", "twitter", "linkedin", "youtube", "facebook"];
      Object.keys(socialLinks).forEach((platform) => {
        if (!allowedPlatforms.includes(platform)) {
          errors.push(`Social link platform '${platform}' is not supported.`);
        } else {
          const val = socialLinks[platform];
          if (val !== undefined && val !== "") {
            if (typeof val !== "string" || !isValidUrl(val)) {
              errors.push(`Social link for '${platform}' must be a valid URL.`);
            }
          }
        }
      });
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

export const validateAvatarUpdate = (req, res, next) => {
  const { avatar } = req.body;
  const errors = [];

  if (!avatar) {
    errors.push("Avatar URL is required.");
  } else if (typeof avatar !== "string" || !isValidUrl(avatar)) {
    errors.push("Avatar must be a valid URL.");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};
