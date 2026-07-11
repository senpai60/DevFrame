"use client";

import { useState } from "react";

interface DevRecommend {
  name: string;
  username: string;
  avatar: string;
  skills: string[];
  bio: string;
  followed: boolean;
}

const SUGGESTED_DEVS: DevRecommend[] = [
  {
    name: "Lee Robinson",
    username: "leerob",
    avatar: "https://avatars.githubusercontent.com/u/322850?v=4",
    skills: ["React", "Next.js", "Vercel", "Tailwind"],
    bio: "VP of Product at Vercel. Helper of React & Next.js frameworks.",
    followed: false,
  },
  {
    name: "Dan Abramov",
    username: "gaearon",
    avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
    skills: ["React", "JavaScript", "Redux", "Hooks"],
    bio: "Co-creator of Redux and React Hooks. Helping build React core.",
    followed: false,
  },
  {
    name: "Sarah Drasner",
    username: "sdras",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    skills: ["TypeScript", "Canvas", "Vue", "Animation"],
    bio: "Engineering leader at Google. Web animator, speaker, and author.",
    followed: false,
  },
  {
    name: "Linus Torvalds",
    username: "torvalds",
    avatar: "https://avatars.githubusercontent.com/u/1024?v=4",
    skills: ["C", "Linux", "Git", "Kernel"],
    bio: "Creator of Git version control system and Linux Operating System.",
    followed: false,
  },
];

const HOT_REPOS = [
  {
    name: "tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development.",
    stars: "82.4k",
    language: "CSS",
    langColor: "#563d7c",
  },
  {
    name: "vercel/next.js",
    description: "The React Framework for the Web.",
    stars: "115.1k",
    language: "JavaScript",
    langColor: "#f1e05a",
  },
  {
    name: "facebook/react",
    description: "The library for web and native user interfaces.",
    stars: "220.4k",
    language: "TypeScript",
    langColor: "#3178c6",
  },
];

export default function ExplorePage() {
  const [devs, setDevs] = useState<DevRecommend[]>(SUGGESTED_DEVS);
  const [repos] = useState(HOT_REPOS);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");

  const tags = ["All", "React", "Next.js", "TypeScript", "Rust", "Python", "CSS"];

  const handleFollow = (username: string) => {
    setDevs(prev =>
      prev.map(d => (d.username === username ? { ...d, followed: !d.followed } : d))
    );
  };

  const filteredDevs = devs.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.username.toLowerCase().includes(search.toLowerCase());
    const matchesTag = activeTag === "All" || d.skills.some(s => s.toLowerCase() === activeTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", width: "100%" }}>
      {/* Page Title */}
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Explore</h1>
          <p className="page-desc">Discover outstanding developers, check trending code bases, and expand your community.</p>
        </div>
      </div>

      {/* Search and Tags */}
      <div className="explore-search-bar">
        <input
          type="text"
          placeholder="Search developers by name or username..."
          className="explore-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="tag-cloud">
        {tags.map(tag => (
          <span
            key={tag}
            className={`tag-badge ${activeTag === tag ? "active" : ""}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 340px", gap: "var(--space-8)" }}>
        {/* Recommended Developers */}
        <div>
          <h2 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Recommended Developers</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {filteredDevs.length > 0 ? (
              filteredDevs.map(d => (
                <div key={d.username} className="creator-card" style={{ padding: "var(--space-4)" }}>
                  <div style={{ display: "flex", gap: "var(--space-4)" }}>
                    <img
                      src={d.avatar}
                      alt={d.name}
                      style={{ width: "54px", height: "54px", borderRadius: "50%", border: "2px solid var(--color-border)", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ fontSize: "var(--text-sm)", fontWeight: 700 }}>{d.name}</h3>
                          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>@{d.username}</span>
                        </div>
                        <button
                          className="creator-submit"
                          onClick={() => handleFollow(d.username)}
                          style={{
                            background: d.followed ? "var(--color-bg-elevated)" : "var(--color-accent)",
                            color: d.followed ? "var(--color-text)" : "#ffffff",
                            border: d.followed ? "1px solid var(--color-border)" : "none",
                            padding: "6px 14px",
                          }}
                        >
                          {d.followed ? "Following" : "Follow"}
                        </button>
                      </div>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "var(--space-2)", lineHeight: 1.4 }}>
                        {d.bio}
                      </p>
                      <div className="skills-list" style={{ marginTop: "var(--space-2)" }}>
                        {d.skills.map(s => (
                          <span key={s} className="skill-tag" style={{ padding: "2px 6px", fontSize: "10px" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)" }}>
                No developers match the active search filters.
              </div>
            )}
          </div>
        </div>

        {/* Hot projects */}
        <div>
          <h2 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-4)" }}>Hot Repositories</h2>
          <div className="suggest-box" style={{ gap: "var(--space-4)" }}>
            {repos.map(r => (
              <div key={r.name} style={{ display: "flex", flexDirection: "column", gap: "6px", borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-3)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href={`https://github.com/${r.name}`} target="_blank" rel="noreferrer" style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text)", textDecoration: "none" }}>
                    {r.name}
                  </a>
                  <span style={{ fontSize: "11px", color: "#eab308" }}>★ {r.stars}</span>
                </div>
                <p style={{ fontSize: "11px", color: "var(--color-text-muted)", lineHeight: 1.4 }}>{r.description}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "var(--color-text-muted)" }}>
                  <span className="lang-dot" style={{ backgroundColor: r.langColor }}></span>
                  <span>{r.language}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
