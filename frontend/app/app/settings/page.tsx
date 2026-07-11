"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../layout";

export default function SettingsPage() {
  const { user, refreshProfile } = useAuth();
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setSkillsText(user.skills ? user.skills.join(", ") : "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setSuccess(null);
    setError(null);

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No active session found.");
      setUpdating(false);
      return;
    }

    // Parse comma-separated skills
    const skillsArray = skillsText
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      const res = await fetch("http://localhost:5000/api/v1/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          username,
          bio,
          skills: skillsArray,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess("Profile settings updated successfully!");
        await refreshProfile(); // Refresh context user info
      } else {
        throw new Error(data.message || data.error?.message || "Failed to update profile settings.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
      {/* Page Title */}
      <div className="page-title-section">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-desc">Modify your public profile details and database specifications.</p>
        </div>
      </div>

      <div className="settings-form-container">
        <h2 className="settings-section-title">Public Profile Details</h2>

        {success && (
          <div style={{ background: "rgba(22, 163, 74, 0.1)", color: "var(--color-success)", border: "1px solid var(--color-success)", borderRadius: "var(--radius-sm)", padding: "var(--space-3)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "var(--radius-sm)", padding: "var(--space-3)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <div className="form-group">
            <label className="form-label" htmlFor="settings-name">Display Name</label>
            <input
              id="settings-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              maxLength={50}
            />
          </div>

          {/* Username field */}
          <div className="form-group">
            <label className="form-label" htmlFor="settings-username">Username</label>
            <input
              id="settings-username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. john_doe"
              maxLength={30}
              required
            />
          </div>

          {/* Bio field */}
          <div className="form-group">
            <label className="form-label" htmlFor="settings-bio">Biography (Bio)</label>
            <textarea
              id="settings-bio"
              className="form-textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other developers about your background..."
              maxLength={250}
            />
          </div>

          {/* Skills field */}
          <div className="form-group">
            <label className="form-label" htmlFor="settings-skills">Skills (comma separated)</label>
            <input
              id="settings-skills"
              type="text"
              className="form-input"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="e.g. React, Next.js, TypeScript, Node.js"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="creator-submit"
            disabled={updating}
            style={{ width: "100%", padding: "var(--space-3)", fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}
          >
            {updating ? "Saving Changes..." : "Save Settings"}
          </button>
        </form>
      </div>
    </div>
  );
}
