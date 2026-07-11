import * as repositoryService from "./repository.service.js";

export const getRepositories = async (req, res, next) => {
  try {
    const repos = await repositoryService.getUserRepositories(req.user);
    res.status(200).json({ repositories: repos });
  } catch (error) {
    next(error);
  }
};

export const syncRepositories = async (req, res, next) => {
  try {
    const repos = await repositoryService.syncRepositoriesFromGithub(req.user);
    res.status(200).json({ repositories: repos });
  } catch (error) {
    next(error);
  }
};

export const toggleSync = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await repositoryService.toggleSync(id, req.user._id);
    res.status(200).json({ repository: updated });
  } catch (error) {
    next(error);
  }
};

export const updateCodeShowcase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codeFileName, codeSnippet } = req.body;
    const updated = await repositoryService.updateCodeShowcase(id, req.user._id, codeFileName, codeSnippet);
    res.status(200).json({ repository: updated });
  } catch (error) {
    next(error);
  }
};
