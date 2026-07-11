import Repository from "./repository.model.js";

export const findUserRepositories = async (userId) => {
  return await Repository.find({ userId }).sort({ stars: -1, name: 1 });
};

export const findRepositoryById = async (id) => {
  return await Repository.findById(id);
};

export const upsertRepository = async (userId, githubRepoId, repoData) => {
  return await Repository.findOneAndUpdate(
    { userId, githubRepoId },
    { $set: repoData },
    { upsert: true, new: true }
  );
};

export const updateRepository = async (id, updateData) => {
  return await Repository.findByIdAndUpdate(id, { $set: updateData }, { new: true });
};
