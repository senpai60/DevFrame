"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../layout";

interface RepositoryItem {
  _id: string;
  name: string;
  description: string;
  url: string;
  homepage?: string;
  language?: string;
  isSynced: boolean;
}

export default function CreateProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRepoId = searchParams.get("repoId") || "";

  // Form states
  const [repositories, setRepositories] = useState<RepositoryItem[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState(initialRepoId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]); // base64 strings
  const [visibility, setVisibility] = useState("public");
  const [status, setStatus] = useState("published");

  // UI state
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [fetchingRepoDetails, setFetchingRepoDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all user repositories for dropdown
  useEffect(() => {
    const fetchRepos = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      try {
        const res = await fetch("http://localhost:5000/api/v1/repositories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Keep only user repos
          setRepositories(data.repositories || []);
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);
      } finally {
        setLoadingRepos(false);
      }
    };
    fetchRepos();
  }, []);

  // Fetch details when repository changes or on initial load
  useEffect(() => {
    if (!selectedRepoId) return;

    const fetchRepoDetails = async () => {
      setFetchingRepoDetails(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:5000/api/v1/repositories/${selectedRepoId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const repo = data.repository;
          if (repo) {
            // Auto fill fields
            setTitle(repo.name || "");
            setDescription(repo.description || "");
            setRepoUrl(repo.url || "");
            setDemoUrl(repo.homepage || "");
            
            const newTech = [];
            if (repo.language) {
              newTech.push(repo.language);
            }
            setTechStack(newTech);
          }
        }
      } catch (err) {
        console.error("Error fetching repo details:", err);
      } finally {
        setFetchingRepoDetails(false);
      }
    };

    fetchRepoDetails();
  }, [selectedRepoId]);

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      filesArray.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            setImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Image deletion handler
  const handleDeleteImage = (indexToDelete: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToDelete));
  };

  // Image reordering handlers
  const handleMoveImage = (index: number, direction: "left" | "right") => {
    if (direction === "left" && index === 0) return;
    if (direction === "right" && index === images.length - 1) return;

    const targetIndex = direction === "left" ? index - 1 : index + 1;
    setImages((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Tech stack chip handlers
  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && techInput.trim()) {
      e.preventDefault();
      if (!techStack.includes(techInput.trim())) {
        setTechStack([...techStack, techInput.trim()]);
      }
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech));
  };

  // Tag chip handlers
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      let cleanTag = tagInput.trim().toLowerCase();
      if (!cleanTag.startsWith("#")) {
        cleanTag = `#${cleanTag}`;
      }
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Front-end Validations
    if (!selectedRepoId) {
      setError("Please select a repository.");
      return;
    }
    if (!title.trim()) {
      setError("Project Title is required.");
      return;
    }
    if (!description.trim()) {
      setError("Project Description is required.");
      return;
    }
    if (images.length === 0) {
      setError("Minimum 1 screenshot is required.");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No active session found.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          repositoryId: selectedRepoId,
          images,
          demoUrl,
          techStack,
          tags,
          visibility,
          status,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("Project showcase published successfully!");
        setTimeout(() => {
          router.push("/app");
        }, 1500);
      } else {
        throw new Error(data.message || data.errors?.join(", ") || "Failed to publish project.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%", paddingBottom: "var(--space-10)" }}>
      {/* Title */}
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Create Project Showcase</h1>
          <p className="page-desc">Feature a synced repository with screenshots, live demo, description, and custom stack.</p>
        </div>
      </div>

      <div className="settings-form-container" style={{ padding: "var(--space-6)" }}>
        {/* Error Display */}
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "var(--radius-sm)", padding: "var(--space-3)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>
            {error}
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--color-success)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-sm)", padding: "var(--space-3)", fontSize: "var(--text-sm)", marginBottom: "var(--space-5)" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          
          {/* Section 1: Basic Info */}
          <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-3)", color: "var(--saas-text)" }}>1. Basic Info</h3>
            
            {/* Repository Select */}
            <div className="form-group">
              <label className="form-label" htmlFor="project-repo">Select Repository</label>
              {loadingRepos ? (
                <div style={{ color: "var(--saas-text-muted)", fontSize: "var(--text-sm)" }}>Loading repositories...</div>
              ) : (
                <select
                  id="project-repo"
                  className="form-input"
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  style={{ background: "#030304", color: "var(--saas-text)", border: "1px solid rgba(255, 255, 255, 0.06)" }}
                  required
                >
                  <option value="">-- Choose a repository --</option>
                  {repositories.map((repo) => (
                    <option key={repo._id} value={repo._id}>
                      {repo.name} {repo.isSynced ? "(Synced)" : ""}
                    </option>
                  ))}
                </select>
              )}
              {selectedRepoId && (
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-success)", marginTop: "4px" }}>
                  ✓ Repository already synced.
                </span>
              )}
            </div>

            {/* Project Title */}
            <div className="form-group" style={{ marginTop: "var(--space-3)" }}>
              <label className="form-label" htmlFor="project-title">Project Title</label>
              <input
                id="project-title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Canvas Physics engine"
                disabled={fetchingRepoDetails}
                required
              />
            </div>
          </div>

          {/* Section 2: Screenshots */}
          <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-2)", color: "var(--saas-text)" }}>2. Screenshots</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--saas-text-muted)", marginBottom: "var(--space-3)" }}>
              Upload images showcasing your application interface. You can delete or reorder them.
            </p>

            {/* Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "2px dashed rgba(255, 255, 255, 0.08)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-5)",
                textAlign: "center",
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.01)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-accent)";
                e.currentTarget.style.background = "rgba(91, 92, 246, 0.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.01)";
              }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ margin: "0 auto var(--space-2)", color: "var(--color-accent)" }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <span style={{ fontSize: "var(--text-sm)", color: "var(--saas-text)" }}>Click to upload multiple screenshots</span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {/* Preview & Reorder list */}
            {images.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", marginTop: "var(--space-4)" }}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      width: "140px",
                      height: "90px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--color-border)",
                      overflow: "hidden",
                      background: "#070709",
                      boxShadow: "var(--shadow-soft)",
                    }}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    
                    {/* Controls Overlay */}
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "rgba(0, 0, 0, 0.8)",
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 8px",
                      alignItems: "center",
                    }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, "left")}
                          disabled={idx === 0}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: idx === 0 ? "#555" : "#fff",
                            cursor: idx === 0 ? "not-allowed" : "pointer",
                            fontSize: "12px",
                          }}
                          title="Move Left"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, "right")}
                          disabled={idx === images.length - 1}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: idx === images.length - 1 ? "#555" : "#fff",
                            cursor: idx === images.length - 1 ? "not-allowed" : "pointer",
                            fontSize: "12px",
                          }}
                          title="Move Right"
                        >
                          →
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(idx)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "11px",
                          fontWeight: 700,
                        }}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                    {/* Position badge */}
                    <span style={{
                      position: "absolute",
                      top: "4px",
                      left: "4px",
                      background: "var(--color-accent)",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "18px",
                      height: "18px",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}>
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Live Demo & Repo Link */}
          <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-3)", color: "var(--saas-text)" }}>3. Showcase URLs</h3>

            {/* Live Demo URL */}
            <div className="form-group">
              <label className="form-label" htmlFor="project-demo-url">Live Demo URL</label>
              <input
                id="project-demo-url"
                type="url"
                className="form-input"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="e.g. https://my-app.vercel.app"
                disabled={fetchingRepoDetails}
              />
            </div>

            {/* GitHub Repo URL (read-only for consistency) */}
            <div className="form-group" style={{ marginTop: "var(--space-3)" }}>
              <label className="form-label" htmlFor="project-repo-url">Repository URL</label>
              <input
                id="project-repo-url"
                type="url"
                className="form-input"
                value={repoUrl}
                placeholder="Auto-filled from GitHub"
                disabled
                style={{ opacity: 0.6, background: "rgba(255, 255, 255, 0.02)" }}
              />
            </div>
          </div>

          {/* Section 4: Description */}
          <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-3)", color: "var(--saas-text)" }}>4. Project Description</h3>
            
            <div className="form-group">
              <label className="form-label" htmlFor="project-description">Rich Description</label>
              <textarea
                id="project-description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project, why you built it, how it works, and key challenges solved..."
                style={{ minHeight: "130px" }}
                disabled={fetchingRepoDetails}
                required
              />
            </div>
          </div>

          {/* Section 5: Tech Stack & Tags */}
          <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "var(--space-4)" }}>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-3)", color: "var(--saas-text)" }}>5. Tech Stack & Tags</h3>

            {/* Tech Stack */}
            <div className="form-group">
              <label className="form-label" htmlFor="project-tech">Tech Stack (Type and press Enter)</label>
              <input
                id="project-tech"
                type="text"
                className="form-input"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="e.g. Next.js, Rust, TailwindCSS"
              />
              {techStack.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      style={{
                        background: "var(--color-accent-soft)",
                        color: "var(--color-accent)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--color-accent)",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="form-group" style={{ marginTop: "var(--space-3)" }}>
              <label className="form-label" htmlFor="project-tags">Tags (Type and press Enter)</label>
              <input
                id="project-tags"
                type="text"
                className="form-input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="e.g. webdev, portfolio, canvas"
              />
              {tags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        color: "var(--saas-text-muted)",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "var(--text-xs)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--saas-text-muted)",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 6: Publish Settings */}
          <div>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: 700, marginBottom: "var(--space-3)", color: "var(--saas-text)" }}>6. Visibility & Status</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
              {/* Visibility */}
              <div className="form-group">
                <label className="form-label" htmlFor="project-visibility">Visibility</label>
                <select
                  id="project-visibility"
                  className="form-input"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                  style={{ background: "#030304", color: "var(--saas-text)", border: "1px solid rgba(255, 255, 255, 0.06)" }}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              {/* Status */}
              <div className="form-group">
                <label className="form-label" htmlFor="project-status">Status</label>
                <select
                  id="project-status"
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ background: "#030304", color: "var(--saas-text)", border: "1px solid rgba(255, 255, 255, 0.06)" }}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="creator-submit"
            disabled={isSubmitting || fetchingRepoDetails}
            style={{
              width: "100%",
              padding: "var(--space-3)",
              fontSize: "var(--text-sm)",
              fontWeight: 700,
              marginTop: "var(--space-4)",
            }}
          >
            {isSubmitting ? "Publishing Showcase..." : "Publish Project Showcase"}
          </button>

        </form>
      </div>
    </div>
  );
}
