"use client";

import { useState } from "react";
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
  const [projects] = useState<ProjectItem[]>(PINNED_PROJECTS);

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
              <span className="profile-stat-val">3</span>
              <span className="profile-stat-lbl">Showcases</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-val">8</span>
              <span className="profile-stat-lbl">Repositories</span>
            </div>
            <div className="profile-stat-item">
              <span className="profile-stat-val">538</span>
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
          {/* Post Showcase Card Mock */}
          <div className="creator-card" style={{ padding: "var(--space-5)" }}>
            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              My Particle Physics Engine Showcase
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "6px" }}>
              Just published a new React hook that makes canvas particle physics a breeze. Check out how easy it is to setup custom bounds and wind speed vectors! 🌬️🌌
            </p>
            <div className="post-repo-card" style={{ marginTop: "var(--space-2)" }}>
              <span className="post-repo-name" style={{ fontSize: "var(--text-sm)" }}>react-canvas-particles</span>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>stars: 342 • language: TypeScript</span>
            </div>
          </div>

          <div className="creator-card" style={{ padding: "var(--space-5)" }}>
            <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Markdown Search CLI
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "6px" }}>
              Wrote a super-fast Python CLI tool to parse local markdown repositories and generate static search indices in under 100ms.
            </p>
            <div className="post-repo-card" style={{ marginTop: "var(--space-2)" }}>
              <span className="post-repo-name" style={{ fontSize: "var(--text-sm)" }}>md-search-indexer</span>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>stars: 184 • language: Python</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="repo-grid">
          {projects.map(p => (
            <div key={p.name} className="repo-page-card selection-box" style={{ minHeight: "150px" }}>
              <div className="repo-header">
                <span className="repo-title-link" style={{ fontSize: "var(--text-base)", fontWeight: 700 }}>
                  {p.name}
                </span>
                <span className="repo-status-badge synced">Synced</span>
              </div>
              <p className="post-repo-desc">{p.description}</p>
              <div className="post-repo-meta">
                <div className="post-repo-meta-item">
                  <span className="lang-dot" style={{ backgroundColor: p.langColor }}></span>
                  <span>{p.language}</span>
                </div>
                <div className="post-repo-meta-item">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#eab308" }}>
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{p.stars}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
