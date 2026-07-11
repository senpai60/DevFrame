"use client";

import { useAuth } from "../layout";

export default function AppDashboard() {
  const { user, error } = useAuth();

  if (error) {
    return (
      <div className="auth-container" style={{ minHeight: "auto", padding: 0 }}>
        <div className="auth-card" style={{ maxWidth: "450px" }}>
          <div className="auth-card__logo" style={{ color: "#ef4444" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="auth-card__title">Session Error</h2>
          <p className="auth-card__subtitle">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      {/* Page Title */}
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Developer Dashboard</h1>
          <p className="page-desc">Overview of your DevFrame profile and Github integration stats.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
        <div className="repo-page-card" style={{ padding: "var(--space-4)", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 600 }}>SYNCED REPOSITORIES</span>
          <span style={{ fontSize: "var(--text-2xl)", fontWeight: 800 }}>8</span>
          <span style={{ fontSize: "10px", color: "var(--color-success)", display: "flex", alignItems: "center", gap: "4px" }}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Active & Auto-synced
          </span>
        </div>
        <div className="repo-page-card" style={{ padding: "var(--space-4)", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 600 }}>PROFILE VIEWS</span>
          <span style={{ fontSize: "var(--text-2xl)", fontWeight: 800 }}>1,240</span>
          <span style={{ fontSize: "10px", color: "var(--color-accent)" }}>+12% this week</span>
        </div>
        <div className="repo-page-card" style={{ padding: "var(--space-4)", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 600 }}>STARS GAINED</span>
          <span style={{ fontSize: "var(--text-2xl)", fontWeight: 800 }}>528</span>
          <span style={{ fontSize: "10px", color: "#eab308" }}>★ Top 5% Developer</span>
        </div>
        <div className="repo-page-card" style={{ padding: "var(--space-4)", gap: "var(--space-1)" }}>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 600 }}>CONNECTIONS</span>
          <span style={{ fontSize: "var(--text-2xl)", fontWeight: 800 }}>42</span>
          <span style={{ fontSize: "10px", color: "var(--color-text-muted)" }}>Followers & collaborators</span>
        </div>
      </div>

      {/* Profile details */}
      <div className="profile-card" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", padding: "var(--space-6)" }}>
        <div className="profile-card__top" style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-6)" }}>
          <img
            src={user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"}
            alt={user.name || user.username}
            style={{ width: "72px", height: "72px", borderRadius: "50%", border: "3px solid var(--color-border)", objectFit: "cover" }}
          />
          <div>
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: 800 }}>{user.name || "GitHub Developer"}</h2>
            <div style={{ color: "var(--color-accent)", fontSize: "var(--text-sm)", fontWeight: 600 }}>@{user.username || user.githubUsername}</div>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "var(--space-2)", lineHeight: 1.5 }}>
              {user.bio || "Full-stack developer building on DevFrame."}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="profile-card__meta-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-4)" }}>
          <div className="meta-item">
            <div className="meta-item__label" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em" }}>Email Address</div>
            <div className="meta-item__value" style={{ fontWeight: 600 }}>{user.email}</div>
          </div>
          <div className="meta-item">
            <div className="meta-item__label" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em" }}>GitHub Username</div>
            <div className="meta-item__value" style={{ fontWeight: 600 }}>{user.githubUsername}</div>
          </div>
          <div className="meta-item">
            <div className="meta-item__label" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em" }}>DevFrame Account ID</div>
            <div className="meta-item__value mono" style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>{user._id}</div>
          </div>
          <div className="meta-item">
            <div className="meta-item__label" style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.03em" }}>Member Since</div>
            <div className="meta-item__value" style={{ fontWeight: 600 }}>
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Skills list */}
        {user.skills && user.skills.length > 0 && (
          <div style={{ marginTop: "var(--space-6)", borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-4)" }}>
            <h3 style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: "var(--space-2)" }}>My Developer Skills</h3>
            <div className="skills-list">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="skill-tag" style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", padding: "4px 10px", fontSize: "var(--text-xs)", fontWeight: 500 }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
