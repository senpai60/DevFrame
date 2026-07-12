import { ApiError } from "../../utils/ApiError.js";

const isValidUrl = (string) => {
  if (!string) return true; // optional urls can be blank
  try {
    const url = new URL(string);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

export const validateProjectCreate = (req, res, next) => {
  const errors = [];
  const { title, description, repositoryId, images, demoUrl } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    errors.push("Title is required and must be a non-empty string.");
  }

  if (!description || typeof description !== "string" || description.trim() === "") {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (!repositoryId) {
    errors.push("Repository selection is required.");
  }

  if (!images || !Array.isArray(images) || images.length === 0) {
    errors.push("Minimum 1 screenshot is required.");
  }

  if (demoUrl && !isValidUrl(demoUrl)) {
    errors.push("Live Demo must be a valid URL.");
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};

export const validateProjectUpdate = (req, res, next) => {
  const errors = [];
  const { title, description, images, demoUrl } = req.body;

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      errors.push("Title cannot be empty.");
    }
  }

  if (description !== undefined) {
    if (typeof description !== "string" || description.trim() === "") {
      errors.push("Description cannot be empty.");
    }
  }

  if (images !== undefined) {
    if (!Array.isArray(images) || images.length === 0) {
      errors.push("Minimum 1 screenshot is required.");
    }
  }

  if (demoUrl !== undefined && demoUrl !== "") {
    if (!isValidUrl(demoUrl)) {
      errors.push("Live Demo must be a valid URL.");
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(400, "Validation failed", errors));
  }

  next();
};
