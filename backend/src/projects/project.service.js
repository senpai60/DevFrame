import * as projectRepo from "./project.repository.js";
import Repository from "../repositories/repository.model.js";
import User from "../users/user.model.js";
import mongoose from "mongoose";

export const createNewProject = async (userId, projectData) => {
  let repo;
  
  // Try finding by ObjectId
  if (projectData.repositoryId && mongoose.Types.ObjectId.isValid(projectData.repositoryId)) {
    repo = await Repository.findById(projectData.repositoryId);
  }

  // Fallback: search by name or create a repository on the fly
  if (!repo) {
    const user = await User.findById(userId);
    const repoName = projectData.repoName || projectData.repositoryId || "showcase-repo";
    
    repo = await Repository.findOne({ userId, name: repoName });
    if (!repo) {
      repo = await Repository.create({
        userId,
        githubRepoId: Math.floor(Math.random() * 1000000) + 9000000,
        name: repoName,
        fullName: `${user?.githubUsername || "dev"}/${repoName}`,
        description: projectData.description || "Showcase repository built on DevFrame.",
        url: `https://github.com/${user?.githubUsername || "dev"}/${repoName}`,
        homepage: projectData.demoUrl || "",
        language: projectData.language || "TypeScript",
        isSynced: true,
      });
    }
  }

  if (!repo.isSynced) {
    repo.isSynced = true;
    await repo.save();
  }

  const newProject = await projectRepo.createProject({
    ...projectData,
    repositoryId: repo._id,
    userId,
    repoUrl: repo.url,
  });
  return newProject;
};

export const getProjectDetails = async (projectId) => {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Project not found");
  return project;
};

export const getProjectByRepoId = async (repoId) => {
  return await projectRepo.findProjectByRepositoryId(repoId);
};

export const updateExistingProject = async (projectId, userId, updateData) => {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Project not found");
  if (project.userId._id.toString() !== userId.toString()) {
    throw new Error("Unauthorized to update this project");
  }

  // If repositoryId is updated, verify it belongs to user
  if (updateData.repositoryId && updateData.repositoryId !== project.repositoryId.toString()) {
    const repo = await Repository.findById(updateData.repositoryId);
    if (!repo || repo.userId.toString() !== userId.toString()) {
      throw new Error("Repository not found or access denied");
    }
    updateData.repoUrl = repo.url;
  }

  return await projectRepo.updateProject(projectId, updateData);
};

export const deleteExistingProject = async (projectId, userId) => {
  const project = await projectRepo.findProjectById(projectId);
  if (!project) throw new Error("Project not found");
  if (project.userId._id.toString() !== userId.toString()) {
    throw new Error("Unauthorized to delete this project");
  }
  return await projectRepo.deleteProject(projectId);
};

export const listAllProjects = async (filter = {}) => {
  return await projectRepo.findAllProjects(filter);
};

export const likeProjectShowcase = async (projectId, userId) => {
  return await projectRepo.toggleLike(projectId, userId);
};

export const addProjectComment = async (projectId, userId, username, avatar, text) => {
  return await projectRepo.addComment(projectId, {
    userId,
    username,
    avatar,
    text,
    createdAt: new Date(),
  });
};
