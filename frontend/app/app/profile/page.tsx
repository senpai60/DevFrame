"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../layout";

interface ProjectItem {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  langColor: string;
}

const PINNED_PROJECTS: ProjectItem[] = [
  {
    name: "react-canvas-particles",
    description: "A lightweight React component & hook library for creating high-performance interactive particle systems on HTML5 Canvas.",
    stars: 342,
    forks: 24,
    language: "TypeScript",
    langColor: "#3178c6",
  },
  {
    name: "md-search-indexer",
    description: "Blazing-fast markdown parser and search index generator, written in Python with critical regex loops accelerated in Rust.",
    stars: 184,
    forks: 12,
    language: "Python",
    langColor: "#3572A5",
  },
  {
    name: "devframe-theme",
    description: "Personal portfolio theme builder with customizable glassmorphic designs and clean animations.",
    stars: 12,
    forks: 1,
    language: "CSS",
    langColor: "#563d7c",
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"showcases" | "repos">("showcases");
  
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [syncedRepos, setSyncedRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getLangColor = (lang: string) => {
    const colors: { [key: string]: string } = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Rust: "#dea584",
      Python: "#3572A5",
      CSS: "#563d7c",
      HTML: "#e34c26",
    };
    return colors[lang] || "#797e8a";
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        // Fetch showcases
        const showRes = await fetch("http://localhost:5000/api/v1/projects/feed");
        if (showRes.ok) {
          const data = await showRes.json();
          const filtered = (data.projects || []).filter((p: any) => p.userId?._id === user._id);
          setUserProjects(filtered);
        }

        // Fetch repositories
        const repoRes = await fetch("http://localhost:5000/api/v1/repositories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (repoRes.ok) {
          const data = await repoRes.json();
          const synced = (data.repositories || []).filter((r: any) => r.isSynced);
          setSyncedRepos(synced);
        }
      } catch (err) {
        console.error("Error fetching profile page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (!user) return null;

  return (
    <div style={{ maxWidth: "850px", margin: "0 auto", width: "100%" }}>
      {/* Cover Banner */}
      <div className="profile-cover"></div>

      {/* Header Info */}
      <div className="profile-header-container">
        <div className="profile-avatar-row">
          <img
            src={user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"}
            alt={user.name || user.username}
            className="profile-page-avatar"
          />
          
          <div className="profile-stats-row">
            <div className="profile-stat-item">
              <span className="profile-stat-val">{userProjects.length}</span>
              <span className="profile-stat-lbl">Showcases</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-val">{syncedRepos.length}</span>
              <span className="profile-stat-lbl">Repositories</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-val">
                {syncedRepos.reduce((acc, r) => acc + (r.stars || 0), 0)}
              </span>
              <span className="profile-stat-lbl">Stars gained</span>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 className="profile-details-name">{user.name || "GitHub Developer"}</h1>
              <div className="profile-details-username">@{user.username || user.githubUsername}</div>
            </div>
            <Link href="/app/settings" className="action-btn" style={{ border: "1px solid var(--color-border)", padding: "8px 16px" }}>
              Edit Profile
            </Link>
          </div>

          <p className="profile-details-bio">{user.bio || "Full-stack developer building on DevFrame."}</p>

          {/* Skills List */}
          {user.skills && user.skills.length > 0 && (
            <div className="skills-list">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "showcases" ? "active" : ""}`}
          onClick={() => setActiveTab("showcases")}
        >
          Showcases
        </button>
        <button
          className={`profile-tab ${activeTab === "repos" ? "active" : ""}`}
          onClick={() => setActiveTab("repos")}
        >
          Synced Repositories
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "showcases" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {userProjects.length > 0 ? (
            userProjects.map((p) => (
              <div key={p._id} className="creator-card" style={{ padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  {p.title}
                </h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "4px" }}>
                  {p.description}
                </p>
                {p.images && p.images.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", marginTop: "8px", overflowX: "auto", paddingBottom: "4px" }}>
                    {p.images.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Screenshot ${idx + 1}`}
                        style={{
                          width: "120px",
                          height: "75px",
                          borderRadius: "var(--radius-sm)",
                          objectFit: "cover",
                          border: "1px solid var(--color-border)",
                          flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                )}
                {p.demoUrl && (
                  <div style={{ marginTop: "4px" }}>
                    <a
                      href={p.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600 }}
                    >
                      Live Demo ↗
                    </a>
                  </div>
                )}
                <div className="post-repo-card" style={{ marginTop: "var(--space-2)" }}>
                  <span className="post-repo-name" style={{ fontSize: "var(--text-sm)" }}>
                    {p.repositoryId?.name || "Repository"}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                    stars: {p.repositoryId?.stars || 0} • language: {p.repositoryId?.language || "Unknown"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-8)", background: "var(--saas-card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
              <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-3)" }}>
                You haven't created any project showcases yet.
              </p>
              <Link href="/app/repositories" className="creator-submit" style={{ display: "inline-block", padding: "8px 16px", textDecoration: "none" }}>
                Create Showcase
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="repo-grid">
          {syncedRepos.length > 0 ? (
            syncedRepos.map(repo => (
              <div key={repo._id} className="repo-page-card selection-box" style={{ minHeight: "150px" }}>
                <div className="repo-header">
                  <span className="repo-title-link" style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>
                    {repo.name}
                  </span>
                  <span className="repo-status-badge synced">Synced</span>
                </div>
                <p className="post-repo-desc">{repo.description}</p>
                <div className="post-repo-meta">
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
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "var(--space-8)", color: "var(--saas-text-muted)" }}>
              No synced repositories found. Synced repositories will show up here.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
