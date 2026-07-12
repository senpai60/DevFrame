import Project from "./project.model.js";

export const createProject = async (projectData) => {
  return await Project.create(projectData);
};

export const findProjectById = async (id) => {
  return await Project.findById(id)
    .populate("userId", "name username avatar githubUsername")
    .populate("repositoryId");
};

export const findProjectByRepositoryId = async (repositoryId) => {
  return await Project.findOne({ repositoryId });
};

export const updateProject = async (id, updateData) => {
  return await Project.findByIdAndUpdate(id, { $set: updateData }, { new: true });
};

export const deleteProject = async (id) => {
  return await Project.findByIdAndDelete(id);
};

export const findAllProjects = async (filter = {}) => {
  return await Project.find(filter)
    .populate("userId", "name username avatar githubUsername")
    .populate("repositoryId")
    .sort({ publishedAt: -1 });
};

export const toggleLike = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  const userIndex = project.likes.indexOf(userId);
  if (userIndex === -1) {
    project.likes.push(userId);
  } else {
    project.likes.splice(userIndex, 1);
  }

  await project.save();
  return project;
};

export const addComment = async (projectId, commentData) => {
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  project.comments.push(commentData);
  await project.save();
  return project;
};
