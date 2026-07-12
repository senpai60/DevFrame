import * as repositoryRepo from "./repository.repository.js";

// Mock repositories fallback
const MOCK_REPOSITORIES = [
  {
    id: 10001,
    name: "react-canvas-particles",
    full_name: "mock/react-canvas-particles",
    description: "A lightweight React component & hook library for creating high-performance interactive particle systems on HTML5 Canvas.",
    html_url: "https://github.com/mock/react-canvas-particles",
    language: "TypeScript",
    stargazers_count: 342,
    forks_count: 24
  },
  {
    id: 10002,
    name: "md-search-indexer",
    full_name: "mock/md-search-indexer",
    description: "Blazing-fast markdown parser and search index generator, written in Python with critical regex loops accelerated in Rust.",
    html_url: "https://github.com/mock/md-search-indexer",
    language: "Python",
    stargazers_count: 184,
    forks_count: 12
  },
  {
    id: 10003,
    name: "devframe-core",
    full_name: "mock/devframe-core",
    description: "The developer portfolio building block and interactive showcase template engine.",
    html_url: "https://github.com/mock/devframe-core",
    language: "TypeScript",
    stargazers_count: 840,
    forks_count: 55
  }
];

export const getUserRepositories = async (user) => {
  let repos = await repositoryRepo.findUserRepositories(user._id);
  // If no repositories exist locally, trigger an initial sync
  if (repos.length === 0) {
    repos = await syncRepositoriesFromGithub(user);
  }
  return repos;
};

export const syncRepositoriesFromGithub = async (user) => {
  let githubRepos = [];

  // Try fetching from GitHub API
  try {
    if (user.githubAccessToken) {
      console.log(`Syncing authenticated repos for ${user.githubUsername}...`);
      const response = await fetch("https://api.github.com/user/repos?per_page=100&type=owner", {
        headers: {
          Authorization: `Bearer ${user.githubAccessToken}`,
          Accept: "application/vnd.github+json",
          "User-Agent": "DevFrame"
        }
      });
      if (response.ok) {
        githubRepos = await response.json();
      } else {
        console.warn(`Authenticated sync failed (status ${response.status}), trying public fallback...`);
      }
    }

    // Fallback 1: Fetch public repositories if no token or token sync failed
    if (githubRepos.length === 0) {
      console.log(`Syncing public repos for ${user.githubUsername}...`);
      const response = await fetch(`https://api.github.com/users/${user.githubUsername}/repos?per_page=100`, {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "DevFrame"
        }
      });
      if (response.ok) {
        githubRepos = await response.json();
      }
    }
  } catch (err) {
    console.error("GitHub API communication error:", err.message);
  }

  // Fallback 2: If we couldn't fetch anything from GitHub, use high-fidelity mocks
  if (!githubRepos || githubRepos.length === 0) {
    console.log("Loading mock repositories fallback...");
    githubRepos = MOCK_REPOSITORIES;
  }

  // Upsert fetched repositories into local MongoDB
  const syncedRepos = [];
  for (const repo of githubRepos) {
    const upserted = await repositoryRepo.upsertRepository(user._id, repo.id, {
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description || "",
      url: repo.html_url,
      homepage: repo.homepage || "",
      language: repo.language || "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
    });
    syncedRepos.push(upserted);
  }

  return syncedRepos.sort((a, b) => b.stars - a.stars);
};

export const toggleSync = async (repoId, userId) => {
  const repo = await repositoryRepo.findRepositoryById(repoId);
  if (!repo || repo.userId.toString() !== userId.toString()) {
    throw new Error("Repository not found or access denied.");
  }
  return await repositoryRepo.updateRepository(repoId, { isSynced: !repo.isSynced });
};

export const updateCodeShowcase = async (repoId, userId, codeFileName, codeSnippet) => {
  const repo = await repositoryRepo.findRepositoryById(repoId);
  if (!repo || repo.userId.toString() !== userId.toString()) {
    throw new Error("Repository not found or access denied.");
  }
  return await repositoryRepo.updateRepository(repoId, { codeFileName, codeSnippet });
};

export const getRepositoryById = async (repoId, userId) => {
  const repo = await repositoryRepo.findRepositoryById(repoId);
  if (!repo || repo.userId.toString() !== userId.toString()) {
    throw new Error("Repository not found or access denied.");
  }
  return repo;
};
