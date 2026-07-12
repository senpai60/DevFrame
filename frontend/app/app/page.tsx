"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "./layout";

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

interface RepoShowcase {
  name: string;
  description: string;
  language: string;
  langColor: string;
  stars: number;
  forks: number;
  codeSnippet?: string;
  codeFileName?: string;
}

interface Post {
  id: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  githubUsername: string;
  caption: string;
  tags: string[];
  createdAt: string;
  repo: RepoShowcase;
  imageUrl?: string;
  likes: number;
  hasLiked: boolean;
  comments: Comment[];
  hasStarred: boolean;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    authorName: "Sarah Drasner",
    authorUsername: "sdras",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
    githubUsername: "sdras",
    caption: "Just published a new React hook that makes canvas particle physics a breeze. Check out how easy it is to setup custom bounds and wind speed vectors! 🌬️🌌",
    tags: ["#react", "#canvas", "#physics", "#webdev"],
    createdAt: "2 hours ago",
    likes: 124,
    hasLiked: false,
    hasStarred: false,
    repo: {
      name: "react-canvas-particles",
      description: "A lightweight React component & hook library for creating high-performance interactive particle systems on HTML5 Canvas.",
      language: "TypeScript",
      langColor: "#3178c6",
      stars: 342,
      forks: 24,
      codeFileName: "useParticles.ts",
      codeSnippet: `import { useEffect, useRef } from 'react';

export function useParticles(options) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Physics engine logic
    const particles = Array.from({ length: options.count || 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * (options.speed || 2),
      vy: (Math.random() - 0.5) * (options.speed || 2),
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx + (options.wind || 0);
        p.y += p.vy;
        
        // Boundaries
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = options.color || '#5b5cf6';
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [options]);

  return canvasRef;
}`,
    },
    comments: [
      {
        id: "c1",
        author: "dan_abramov",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120",
        text: "Clean use of requestAnimationFrame! Have you looked at batching updates?",
        time: "1h ago",
      },
      {
        id: "c2",
        author: "sarah_dev",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        text: "Using this in my portfolio website. Works like a charm!",
        time: "30m ago",
      },
    ],
  },
  {
    id: "post-2",
    authorName: "Alexandre Dev",
    authorUsername: "alexdev",
    authorAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=120",
    githubUsername: "alexdev",
    caption: "Wrote a super-fast Python CLI tool to parse local markdown repositories and generate static search indices in under 100ms. Check the Rust bindings I'm experimenting with!",
    tags: ["#python", "#rust", "#cli", "#markdown"],
    createdAt: "5 hours ago",
    likes: 89,
    hasLiked: false,
    hasStarred: false,
    repo: {
      name: "md-search-indexer",
      description: "Blazing-fast markdown parser and search index generator, written in Python with critical regex loops accelerated in Rust.",
      language: "Python",
      langColor: "#3572A5",
      stars: 184,
      forks: 12,
      codeFileName: "indexer.py",
      codeSnippet: `import os
import re
import json
from ctypes import CDLL

class MarkdownIndexer:
    def __init__(self, directory):
        self.directory = directory
        self.index = {}
        # Load Rust shared library
        self.rust_lib = CDLL('./librust_parser.so')

    def index_all(self):
        for root, _, files in os.walk(self.directory):
            for file in files:
                if file.endswith('.md'):
                    path = os.path.join(root, file)
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        title = self.extract_title(content)
                        self.index[path] = {
                            "title": title,
                            "length": len(content),
                            "headers": self.extract_headers(content)
                        }
        return json.dumps(self.index)

    def extract_title(self, text):
        match = re.search(r'^#\s+(.+)$', text, re.MULTILINE)
        return match.group(1) if match else "Untitled"`,
    },
    comments: [
      {
        id: "c3",
        author: "rust_coder",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120",
        text: "Python + Rust bindings = absolute speed! Keep it up.",
        time: "4h ago",
      },
    ],
  },
  {
    id: "post-3",
    authorName: "Dan Abramov",
    authorUsername: "gaearon",
    authorAvatar: "https://avatars.githubusercontent.com/u/810438?v=4",
    githubUsername: "gaearon",
    caption: "Spent the weekend redesigning the React docs layout. Exploring deep dark schemas with high-density grid lines and clean burnt orange focal indicators. Let me know what you think of this visual preview! ⚛️🎨📐",
    tags: ["#react", "#uidesign", "#webdevelopment", "#minimalist"],
    createdAt: "1 day ago",
    likes: 412,
    hasLiked: false,
    hasStarred: false,
    imageUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800",
    repo: {
      name: "react-docs-new",
      description: "Next-generation documentation builder for React APIs, featuring interactive code sandboxes and responsive structural guide systems.",
      language: "TypeScript",
      langColor: "#3178c6",
      stars: 1205,
      forks: 180,
    },
    comments: [
      {
        id: "c4",
        author: "leerob",
        avatar: "https://avatars.githubusercontent.com/u/322850?v=4",
        text: "The grid line guide overlays look incredibly crisp! Outstanding design work Dan.",
        time: "20h ago",
      },
      {
        id: "c5",
        author: "sdras",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120",
        text: "This rust-orange tint is so much better than standard blue highlights.",
        time: "18h ago",
      },
    ],
  },
];

const SUGGESTED_DEVELOPERS = [
  {
    name: "Linus Torvalds",
    username: "torvalds",
    avatar: "https://avatars.githubusercontent.com/u/1024?v=4",
    desc: "Creator of Linux & Git",
  },
  {
    name: "Dan Abramov",
    username: "gaearon",
    avatar: "https://avatars.githubusercontent.com/u/810438?v=4",
    desc: "Co-creator of Redux",
  },
  {
    name: "Lee Robinson",
    username: "leerob",
    avatar: "https://avatars.githubusercontent.com/u/322850?v=4",
    desc: "VP of Product at Vercel",
  },
];

const TRENDING_REPOS = [
  {
    name: "devframe/core",
    description: "The developer portfolio building block",
    stars: 840,
    language: "TypeScript",
  },
  {
    name: "antigravity/ai-shell",
    description: "Interactive agentic code builder",
    stars: 1205,
    language: "Rust",
  },
];

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedDevs, setSuggestedDevs] = useState(SUGGESTED_DEVELOPERS.map(d => ({ ...d, followed: false })));
  const [trendingRepos, setTrendingRepos] = useState(TRENDING_REPOS.map(r => ({ ...r, starred: false })));

  // Load backend feed projects
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/projects/feed");
        if (res.ok) {
          const data = await res.json();
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

          const formatted: Post[] = (data.projects || []).map((p: any) => ({
            id: p._id,
            authorName: p.userId?.name || "GitHub Developer",
            authorUsername: p.userId?.username || p.userId?.githubUsername || "dev",
            authorAvatar: p.userId?.avatar || "https://avatars.githubusercontent.com/u/583231?v=4",
            githubUsername: p.userId?.githubUsername || "dev",
            caption: p.description,
            tags: p.tags && p.tags.length > 0 ? p.tags : ["#webdev", "#showcase"],
            createdAt: new Date(p.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            repo: {
              name: p.repositoryId?.name || "repository",
              description: p.repositoryId?.description || "",
              language: p.repositoryId?.language || "",
              langColor: getLangColor(p.repositoryId?.language || ""),
              stars: p.repositoryId?.stars || 0,
              forks: p.repositoryId?.forks || 0,
            },
            imageUrl: p.images && p.images.length > 0 ? p.images[0] : undefined,
            likes: p.likes ? p.likes.length : 0,
            hasLiked: user ? (p.likes || []).includes(user._id) : false,
            comments: (p.comments || []).map((c: any) => ({
              id: c._id,
              author: c.username,
              avatar: c.avatar || "https://avatars.githubusercontent.com/u/583231?v=4",
              text: c.text,
              time: new Date(c.createdAt).toLocaleDateString(),
            })),
            hasStarred: false,
          }));

          setPosts(formatted);
        }
      } catch (err) {
        console.error("Error fetching project feed:", err);
      }
    };
    fetchFeed();
  }, [user]);

  // Creator state
  const [caption, setCaption] = useState("");
  const [repoName, setRepoName] = useState("");
  const [repoDesc, setRepoDesc] = useState("");
  const [lang, setLang] = useState("TypeScript");
  const [snippet, setSnippet] = useState("");
  const [fileName, setFileName] = useState("");
  const [expandCreatorRepo, setExpandCreatorRepo] = useState(false);
  const [creatorTab, setCreatorTab] = useState<"code" | "image">("code");
  const [imageUrl, setImageUrl] = useState("");

  // Active code snippet viewers
  const [expandedSnippets, setExpandedSnippets] = useState<{ [key: string]: boolean }>({});
  
  // Collapsed comments threads
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  const toggleSnippet = (postId: string) => {
    setExpandedSnippets(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = async (postId: string) => {
    if (!postId.startsWith("post-")) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await fetch(`http://localhost:5000/api/v1/projects/${postId}/like`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) return;
        } catch (err) {
          console.error("Error liking project:", err);
          return;
        }
      }
    }

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.hasLiked ? post.likes - 1 : post.likes + 1,
            hasLiked: !post.hasLiked,
          };
        }
        return post;
      })
    );
  };

  const handleStarRepo = (postId: string) => {
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const updatedRepo = {
            ...post.repo,
            stars: post.hasStarred ? post.repo.stars - 1 : post.repo.stars + 1,
          };
          return {
            ...post,
            repo: updatedRepo,
            hasStarred: !post.hasStarred,
          };
        }
        return post;
      })
    );
  };

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  const handleCommentChange = (postId: string, text: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText || !user) return;

    if (!postId.startsWith("post-")) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await fetch(`http://localhost:5000/api/v1/projects/${postId}/comments`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: commentText }),
          });
          if (!res.ok) return;
        } catch (err) {
          console.error("Error commenting on project:", err);
          return;
        }
      }
    }

    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const newComment: Comment = {
            id: `c-${Date.now()}`,
            author: user.username || user.githubUsername,
            avatar: user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4",
            text: commentText,
            time: "Just now",
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  const handleFollowDeveloper = (username: string) => {
    setSuggestedDevs(prev =>
      prev.map(d => (d.username === username ? { ...d, followed: !d.followed } : d))
    );
  };

  const handleStarTrendingRepo = (name: string) => {
    setTrendingRepos(prev =>
      prev.map(r => {
        if (r.name === name) {
          return {
            ...r,
            starred: !r.starred,
            stars: r.starred ? r.stars - 1 : r.stars + 1,
          };
        }
        return r;
      })
    );
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !user) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const langColors: { [key: string]: string } = {
      TypeScript: "#3178c6",
      JavaScript: "#f1e05a",
      Rust: "#dea584",
      Python: "#3572A5",
      CSS: "#563d7c",
      HTML: "#e34c26",
    };

    const finalRepoName = repoName.trim() || "showcase-repo";
    const finalImageUrl = creatorTab === "image" 
      ? (imageUrl.trim() || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800")
      : "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800";

    try {
      const res = await fetch("http://localhost:5000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: finalRepoName,
          description: caption,
          repositoryId: finalRepoName,
          images: [finalImageUrl],
          demoUrl: creatorTab === "image" ? imageUrl.trim() : "",
          techStack: [lang],
          tags: caption.match(/#\w+/g) || ["#webdev"],
          visibility: "public",
          status: "published",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const p = data.project;

        const newPost: Post = {
          id: p._id,
          authorName: user.name || "GitHub Developer",
          authorUsername: user.username || user.githubUsername,
          authorAvatar: user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4",
          githubUsername: user.githubUsername,
          caption: p.description,
          tags: p.tags && p.tags.length > 0 ? p.tags : ["#webdev"],
          createdAt: "Just now",
          likes: 0,
          hasLiked: false,
          hasStarred: false,
          repo: {
            name: finalRepoName,
            description: repoDesc.trim() || "Showcase repository built on DevFrame.",
            language: lang,
            langColor: langColors[lang] || "#5b5cf6",
            stars: 0,
            forks: 0,
            codeFileName: fileName.trim() || "App.tsx",
            codeSnippet: creatorTab === "code" ? (snippet.trim() || undefined) : undefined,
          },
          imageUrl: finalImageUrl,
          comments: [],
        };

        setPosts([newPost, ...posts]);
      } else {
        const errData = await res.json();
        console.error("Backend post failed:", errData);
      }
    } catch (err) {
      console.error("Network error posting showcase:", err);
    }

    setCaption("");
    setRepoName("");
    setRepoDesc("");
    setSnippet("");
    setFileName("");
    setImageUrl("");
    setExpandCreatorRepo(false);
  };

  return (
    <div className="feed-layout">
      {/* Feed Posts Timeline */}
      <section className="feed-stream">
        {/* Creator panel */}
        <div className="creator-card">
          <form onSubmit={handleCreatePost}>
            {/* Tab Selector */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "var(--space-3)", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: "8px" }}>
              <button
                type="button"
                className={`creator-tab-button ${creatorTab === "code" ? "active" : ""}`}
                onClick={() => setCreatorTab("code")}
              >
                Code Post
              </button>
              <button
                type="button"
                className={`creator-tab-button ${creatorTab === "image" ? "active" : ""}`}
                onClick={() => setCreatorTab("image")}
              >
                Image Post
              </button>
            </div>

            <div className="creator-header">
              <img
                src={user?.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"}
                alt="Your Avatar"
                className="creator-avatar"
              />
              <div className="creator-input-container">
                <textarea
                  className="creator-textarea"
                  placeholder={creatorTab === "code" ? "Showcase your code! Write a caption here..." : "Showcase your project UI! Write a caption here..."}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                />
              </div>
            </div>

            {expandCreatorRepo && (
              <div style={{ marginTop: "var(--space-2)", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
                  <input
                    type="text"
                    placeholder="Repository Name (e.g. devframe)"
                    className="explore-input"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    style={{ fontSize: "var(--text-xs)" }}
                  />
                  <select
                    className="creator-select"
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="Rust">Rust</option>
                    <option value="Python">Python</option>
                    <option value="CSS">CSS</option>
                    <option value="HTML">HTML</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Repository Description"
                  className="explore-input"
                  value={repoDesc}
                  onChange={(e) => setRepoDesc(e.target.value)}
                  style={{ fontSize: "var(--text-xs)" }}
                />
                
                {creatorTab === "code" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Showcase Filename (e.g. index.js)"
                      className="explore-input"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      style={{ fontSize: "var(--text-xs)" }}
                    />
                    <textarea
                      placeholder="Paste a short code snippet..."
                      className="form-textarea"
                      value={snippet}
                      onChange={(e) => setSnippet(e.target.value)}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", minHeight: "80px" }}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder="Screenshot Image URL (leave blank for mock UI screenshot)"
                    className="explore-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ fontSize: "var(--text-xs)" }}
                  />
                )}
              </div>
            )}

            <div className="creator-options">
              <button
                type="button"
                className="action-btn"
                onClick={() => setExpandCreatorRepo(!expandCreatorRepo)}
                style={{ fontSize: "var(--text-xs)", padding: "var(--space-2)" }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {expandCreatorRepo ? "Hide Repo Showcase" : "Link Repo Showcase"}
              </button>

              <button
                type="submit"
                className="creator-submit"
                disabled={!caption.trim()}
              >
                {creatorTab === "code" ? "Post Code" : "Post Image"}
              </button>
            </div>
          </form>
        </div>

        {/* Post Items */}
        {posts.length > 0 ? (
          posts.map((post) => {
          const isCodeExpanded = expandedSnippets[post.id];
          return (
            <article key={post.id} className="feed-post">
              {/* Header */}
              <div className="post-header">
                <div className="post-author">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="post-author-avatar"
                  />
                  <div className="post-author-info">
                    <span className="post-author-name">{post.authorName}</span>
                    <div className="post-author-meta">
                      <span className="post-time">{post.createdAt}</span>
                      <span>•</span>
                      <a
                        href={`https://github.com/${post.githubUsername}`}
                        target="_blank"
                        rel="noreferrer"
                        className="post-github-badge"
                      >
                        GitHub
                      </a>
                    </div>
                  </div>
                </div>
                <button className="action-btn" style={{ padding: 0 }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>

              {/* Post Visual Media Block */}
              {(post.repo || post.imageUrl) && (
                <div className="post-media-block" style={{ marginTop: "var(--space-2)", padding: post.imageUrl ? "0" : "var(--space-5)" }}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} className="post-media-image" alt="Project Showcase" />
                  ) : (
                    <div className="mock-editor-window">
                      <div className="mock-editor-header">
                        <div className="mock-editor-dots">
                          <div className="mock-editor-dot red" />
                          <div className="mock-editor-dot yellow" />
                          <div className="mock-editor-dot green" />
                        </div>
                        <span className="mock-editor-title">
                          {post.repo.codeFileName || "main.js"}
                        </span>
                        <div style={{ width: "30px" }} />
                      </div>
                      <pre className="mock-editor-body">
                        <code>{post.repo.codeSnippet || `// ${post.repo.name}\n\n${post.repo.description}`}</code>
                      </pre>
                    </div>
                  )}

                  {/* Floating overlay badge */}
                  {post.repo && (
                    <a
                      href={`https://github.com/${post.githubUsername}/${post.repo.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="post-repo-badge-floating selection-box"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                      <span>{post.repo.name}</span>
                      <span style={{ color: "#eab308" }}>★ {post.repo.stars}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="post-actions">
                <button
                  className={`action-btn ${post.hasLiked ? "liked" : ""}`}
                  onClick={() => handleLike(post.id)}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span>Like</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => {
                    const el = document.getElementById(`comment-input-${post.id}`);
                    if (el) el.focus();
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Comment</span>
                </button>
                <button className="action-btn">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>Share</span>
                </button>
                <button
                  className={`action-btn ${post.hasStarred ? "starred" : ""}`}
                  onClick={() => handleStarRepo(post.id)}
                  style={{ marginLeft: "auto" }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>Star</span>
                </button>
              </div>

              {/* Engagement line */}
              <div className="post-engagement" style={{ display: "flex", alignItems: "center" }}>
                <div className="avatar-overlap-list">
                  <img src="https://avatars.githubusercontent.com/u/1024?v=4" className="avatar-overlap-item" alt="user" />
                  <img src="https://avatars.githubusercontent.com/u/810438?v=4" className="avatar-overlap-item" alt="user" />
                  <img src="https://avatars.githubusercontent.com/u/322850?v=4" className="avatar-overlap-item" alt="user" />
                </div>
                <span>{post.likes} {post.likes === 1 ? "like" : "likes"}</span>
              </div>

              {/* Caption & Hashtags */}
              <div className="post-body" style={{ paddingTop: "var(--space-2)", paddingBottom: "var(--space-2)" }}>
                <p className="post-caption" style={{ margin: 0 }}>
                  <span style={{ fontWeight: 800, marginRight: "var(--space-2)" }}>{post.authorUsername}</span>
                  {post.caption}
                </p>
                {post.tags.length > 0 && (
                  <div className="post-tags" style={{ marginTop: "6px" }}>
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="post-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Toggle */}
              {post.comments.length > 0 && (
                <button
                  type="button"
                  className="suggest-profile-btn"
                  onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "8px 0",
                    color: "var(--saas-text-muted)",
                    fontSize: "11px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: 600,
                    display: "block",
                    width: "fit-content"
                  }}
                >
                  {showComments[post.id] ? "Hide comments" : `View all ${post.comments.length} comments`}
                </button>
              )}

              {/* Comments block */}
              {post.comments.length > 0 && showComments[post.id] && (
                <div className="post-comments">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="post-comment-item">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        style={{ width: "20px", height: "20px", borderRadius: "50%" }}
                      />
                      <div>
                        <Link href={`/app/profile`} className="comment-author">
                          {comment.author}
                        </Link>{" "}
                        <span className="comment-text">{comment.text}</span>
                        <div style={{ fontSize: "9px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                          {comment.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <form
                className="post-comment-box"
                onSubmit={(e) => handleCommentSubmit(post.id, e)}
              >
                <input
                  id={`comment-input-${post.id}`}
                  type="text"
                  placeholder="Add a comment..."
                  className="comment-input"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                />
                <button
                  type="submit"
                  className="comment-submit"
                  disabled={!(commentInputs[post.id]?.trim())}
                >
                  Post
                </button>
              </form>
            </article>
          );
        })
        ) : (
          <div style={{ textAlign: "center", padding: "var(--space-10)", background: "var(--saas-card-bg)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", marginTop: "var(--space-4)" }}>
            <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)", marginBottom: "var(--space-2)" }}>
              No project showcases published on DevFrame yet.
            </p>
            <p style={{ color: "var(--saas-text-muted)", fontSize: "var(--text-xs)" }}>
              Publish your first project using the creator card above, or sync a repository via the Repositories tab to showcase your build!
            </p>
          </div>
        )}
      </section>

      {/* Right Suggestions Column */}
      <aside className="feed-suggestions">
        {/* Current profile summary */}
        {user && (
          <div className="suggest-profile">
            <Link href="/app/profile" className="suggest-profile-link">
              <img
                src={user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"}
                alt="Avatar"
                className="suggest-profile-avatar"
              />
              <div className="suggest-profile-meta">
                <span className="suggest-profile-name">{user.name || "Developer"}</span>
                <span className="suggest-profile-handle">@{user.username || user.githubUsername}</span>
              </div>
            </Link>
            <Link href="/app/profile" className="suggest-profile-btn">
              View Profile
            </Link>
          </div>
        )}

        {/* Suggested developers to follow */}
        <div className="suggest-box">
          <div className="suggest-title">Suggestions For You</div>
          <div className="suggest-list">
            {suggestedDevs.map((dev) => (
              <div key={dev.username} className="suggest-item">
                <div className="suggest-item-info">
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="suggest-item-avatar"
                  />
                  <div className="suggest-item-details">
                    <span className="suggest-item-name">{dev.name}</span>
                    <span className="suggest-item-desc">{dev.desc}</span>
                  </div>
                </div>
                <button
                  className="suggest-item-action"
                  onClick={() => handleFollowDeveloper(dev.username)}
                >
                  {dev.followed ? "Following" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Repos */}
        <div className="suggest-box">
          <div className="suggest-title">Trending Repositories</div>
          <div className="suggest-list">
            {trendingRepos.map((repo) => (
              <div key={repo.name} className="suggest-item">
                <div className="suggest-item-info">
                  <div className="suggest-item-details">
                    <span className="suggest-item-name" style={{ fontSize: "var(--text-xs)", fontWeight: 650 }}>{repo.name}</span>
                    <span className="suggest-item-desc">{repo.description}</span>
                  </div>
                </div>
                <button
                  className="suggest-item-action"
                  onClick={() => handleStarTrendingRepo(repo.name)}
                >
                  {repo.starred ? "★ Starred" : "☆ Star"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
