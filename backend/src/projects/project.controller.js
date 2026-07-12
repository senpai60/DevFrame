import * as projectService from "./project.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const createProject = async (req, res, next) => {
  try {
    const newProject = await projectService.createNewProject(req.user._id, req.body);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await projectService.getProjectDetails(req.params.id);
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(new ApiError(404, error.message));
  }
};

export const getProjectByRepo = async (req, res, next) => {
  try {
    const project = await projectService.getProjectByRepoId(req.params.repoId);
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(new ApiError(404, error.message));
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const updatedProject = await projectService.updateExistingProject(
      req.params.id,
      req.user._id,
      req.body
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await projectService.deleteExistingProject(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const getFeed = async (req, res, next) => {
  try {
    const projects = await projectService.listAllProjects({ visibility: "public", status: "published" });
    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const likeProject = async (req, res, next) => {
  try {
    const updated = await projectService.likeProjectShowcase(req.params.id, req.user._id);
    res.status(200).json({
      success: true,
      likes: updated.likes,
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === "") {
      throw new Error("Comment text is required");
    }

    const updated = await projectService.addProjectComment(
      req.params.id,
      req.user._id,
      req.user.username || req.user.githubUsername,
      req.user.avatar,
      text
    );

    res.status(201).json({
      success: true,
      comments: updated.comments,
    });
  } catch (error) {
    next(new ApiError(400, error.message));
  }
};
