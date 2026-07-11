"use client";

import { useState } from "react";
import { useAuth } from "../layout";

interface RepoItem {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  langColor: string;
  synced: boolean;
  visibility: "public" | "private";
}

const INITIAL_REPOS: RepoItem[] = [
  {
    name: "react-canvas-particles",
    description: "A lightweight React component & hook library for creating high-performance interactive particle systems on HTML5 Canvas.",
    stars: 342,
    forks: 24,
    language: "TypeScript",
    langColor: "#3178c6",
    synced: true,
    visibility: "public",
  },
  {
    name: "md-search-indexer",
    description: "Blazing-fast markdown parser and search index generator, written in Python with critical regex loops accelerated in Rust.",
    stars: 184,
    forks: 12,
    language: "Python",
    langColor: "#3572A5",
    synced: true,
    visibility: "public",
  },
  {
    name: "devframe-theme",
    description: "Personal portfolio theme builder with customizable glassmorphic designs and clean animations.",
    stars: 12,
    forks: 1,
    language: "CSS",
    langColor: "#563d7c",
    synced: true,
    visibility: "public",
  },
  {
    name: "auth-bypass-utils",
    description: "Development environment helpers for mock credentials, testing JWT refreshes, and cookie setups.",
    stars: 3,
    forks: 0,
    language: "JavaScript",
    langColor: "#f1e05a",
    synced: false,
    visibility: "public",
  },
  {
    name: "docker-mern-boilerplate",
    description: "Clean boilerplate setup for Dockerized Node, Express, MongoDB and React configurations.",
    stars: 28,
    forks: 6,
    language: "HTML",
    langColor: "#e34c26",
    synced: false,
    visibility: "public",
  },
];

export default function RepositoriesPage() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<RepoItem[]>(INITIAL_REPOS);
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSync = (repoName: string) => {
    setRepos(prev =>
      prev.map(r => {
        if (r.name === repoName) {
          const newStatus = !r.synced;
          if (newStatus) {
            alert(`"${repoName}" has been synced to your DevFrame feed!`);
          }
          return { ...r, synced: newStatus };
        }
        return r;
      })
    );
  };

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setRepos(prev => prev.map(r => ({ ...r, synced: true })));
      setSyncing(false);
      alert("All public GitHub repositories synced successfully!");
    }, 1500);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      {/* Page Title & Actions */}
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Repositories</h1>
          <p className="page-desc">Manage which GitHub repositories are synced and featured on your DevFrame social feed.</p>
        </div>
        <button
          className="creator-submit"
          onClick={handleSyncAll}
          disabled={syncing}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          {syncing ? (
            <>
              <div className="spinner" style={{ width: "12px", height: "12px", borderWidth: "2px" }}></div>
              Syncing...
            </>
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.73-2.19" />
              </svg>
              Sync GitHub Repos
            </>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="explore-search-bar">
        <input
          type="text"
          placeholder="Search repositories by name..."
          className="explore-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Repositories Cards Grid */}
      <div className="repo-grid">
        {filteredRepos.length > 0 ? (
          filteredRepos.map((repo) => (
            <div key={repo.name} className="repo-page-card selection-box">
              <div className="repo-header">
                <div className="repo-name-badge">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: "var(--color-text-muted)" }}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <a
                    href={user ? `https://github.com/${user.githubUsername}/${repo.name}` : "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-title-link"
                  >
                    {repo.name}
                  </a>
                </div>
                <span className={`repo-status-badge ${repo.synced ? "synced" : "unsynced"}`}>
                  {repo.synced ? "Synced" : "Not Synced"}
                </span>
              </div>

              <p className="post-repo-desc" style={{ flex: 1 }}>{repo.description}</p>

              <div className="repo-footer-actions">
                <div className="post-repo-meta" style={{ marginTop: 0 }}>
                  <div className="post-repo-meta-item">
                    <span className="lang-dot" style={{ backgroundColor: repo.langColor }}></span>
                    <span>{repo.language}</span>
                  </div>
                  <div className="post-repo-meta-item">
                    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#eab308" }}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{repo.stars}</span>
                  </div>
                </div>

                <button
                  className="suggest-profile-btn"
                  onClick={() => toggleSync(repo.name)}
                  style={{ color: repo.synced ? "#ef4444" : "var(--color-accent)", fontWeight: 600, fontSize: "var(--text-xs)" }}
                >
                  {repo.synced ? "Remove Sync" : "Sync & Feature"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
            No repositories found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
