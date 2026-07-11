"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../layout";

interface RepoItem {
  _id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  isSynced: boolean;
}

const getLangColor = (lang: string) => {
  const colors: { [key: string]: string } = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Rust: "#dea584",
    Python: "#3572A5",
    CSS: "#563d7c",
    HTML: "#e34c26",
    Go: "#00add8",
    C: "#555555",
    Cpp: "#f34b7d",
    Java: "#b07219",
  };
  return colors[lang] || "#797e8a";
};

export default function RepositoriesPage() {
  const { user } = useAuth();
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [search, setSearch] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cached repositories on mount
  useEffect(() => {
    const fetchRepos = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/v1/repositories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setRepos(data.repositories);
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSync = async (repoId: string, repoName: string) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/v1/repositories/${repoId}/sync-toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(prev =>
          prev.map(r => (r._id === repoId ? { ...r, isSynced: data.repository.isSynced } : r))
        );
        if (data.repository.isSynced) {
          alert(`"${repoName}" has been successfully featured on your profile page!`);
        } else {
          alert(`"${repoName}" removed from featured list.`);
        }
      }
    } catch (err) {
      console.error("Error toggling sync:", err);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setSyncing(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/repositories/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repositories);
        alert("GitHub repositories synchronized successfully!");
      } else {
        alert("Failed to sync repositories.");
      }
    } catch (err) {
      console.error("Sync error:", err);
      alert("An error occurred during synchronization.");
    } finally {
      setSyncing(false);
    }
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
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-12)" }}>
          <div className="spinner" style={{ width: "24px", height: "24px", borderWidth: "3px" }}></div>
        </div>
      ) : (
        <div className="repo-grid">
          {filteredRepos.length > 0 ? (
            filteredRepos.map((repo) => (
              <div key={repo._id} className="repo-page-card selection-box">
                <div className="repo-header">
                  <div className="repo-name-badge">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: "var(--saas-text-muted)" }}>
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
                  <span className={`repo-status-badge ${repo.isSynced ? "synced" : "unsynced"}`}>
                    {repo.isSynced ? "Synced" : "Not Synced"}
                  </span>
                </div>

                <p className="post-repo-desc" style={{ flex: 1 }}>{repo.description}</p>

                <div className="repo-footer-actions">
                  <div className="post-repo-meta" style={{ marginTop: 0 }}>
                    <div className="post-repo-meta-item">
                      <span className="lang-dot" style={{ backgroundColor: getLangColor(repo.language) }}></span>
                      <span>{repo.language || "Unknown"}</span>
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
                    onClick={() => toggleSync(repo._id, repo.name)}
                    style={{ color: repo.isSynced ? "#ef4444" : "#e0522e", fontWeight: 600, fontSize: "var(--text-xs)", background: "transparent", border: "none", cursor: "pointer" }}
                  >
                    {repo.isSynced ? "Remove Sync" : "Sync & Feature"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-12)", color: "var(--saas-text-muted)" }}>
              No repositories found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
