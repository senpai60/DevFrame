"use client";

import { useEffect, useState } from "react";

interface UserProfile {
  _id: string;
  name?: string;
  username?: string;
  email: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  githubUsername: string;
  createdAt: string;
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 1. Parse token from URL query params
        const params = new URLSearchParams(window.location.search);
        let token = params.get("token");

        if (token) {
          localStorage.setItem("accessToken", token);
          
          // Clean up the URL to prevent the token from leaking or staying in the bar
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, document.title, url.pathname);
        } else {
          // 2. Fallback to localStorage
          token = localStorage.getItem("accessToken");
        }

        if (!token) {
          // Attempt to refresh immediately in case cookie exists but token is lost
          const refreshed = await attemptTokenRefresh();
          if (refreshed) {
            token = refreshed;
          } else {
            redirectToLogin();
            return;
          }
        }

        // 3. Fetch user profile
        await fetchProfile(token);
      } catch (err: any) {
        console.error("Auth initialization error:", err);
        setError("Failed to initialize session");
        setLoading(false);
      }
    };

    handleAuth();
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setLoading(false);
      } else if (res.status === 401) {
        // Token might have expired, attempt to refresh
        const refreshedToken = await attemptTokenRefresh();
        if (refreshedToken) {
          // Retry profile fetch with new token
          await fetchProfile(refreshedToken);
        } else {
          redirectToLogin();
        }
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const attemptTokenRefresh = async (): Promise<string | null> => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include", // Required to send the HttpOnly refresh token cookie
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        return data.accessToken;
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
    }
    return null;
  };

  const redirectToLogin = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include", // Send cookie to be cleared
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      redirectToLogin();
    }
  };

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" id="dashboard-spinner"></div>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
          Loading your profile...
        </p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: "400px" }}>
          <div className="auth-card__logo" style={{ color: "#ef4444" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="auth-card__title" style={{ fontSize: "var(--text-lg)" }}>Session Error</h2>
          <p className="auth-card__subtitle" style={{ marginBottom: "var(--space-6)" }}>{error}</p>
          <button className="btn-auth btn-github" onClick={redirectToLogin}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title" id="dashboard-title-header">Developer Dashboard</h1>
        <button
          id="btn-logout"
          className="btn-logout"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      {/* User Profile Card */}
      {user && (
        <div className="profile-card" id="user-profile-card">
          <div className="profile-card__top">
            <div className="profile-card__avatar-container">
              <img
                src={user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"}
                alt={user.name || user.username}
                className="profile-card__avatar"
                id="user-profile-avatar"
              />
            </div>
            <div>
              <h2 className="profile-card__name" id="user-profile-name">
                {user.name || "GitHub Developer"}
              </h2>
              <div className="profile-card__username" id="user-profile-username">
                @{user.username || user.githubUsername}
              </div>
              <p className="profile-card__bio" id="user-profile-bio">
                {user.bio || "Full-stack developer building on DevFrame."}
              </p>
            </div>
          </div>

          {/* Profile metadata fields */}
          <div className="profile-card__meta-grid">
            <div className="meta-item">
              <div className="meta-item__label">Email Address</div>
              <div className="meta-item__value" id="user-profile-email">
                {user.email}
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-item__label">GitHub Username</div>
              <div className="meta-item__value" id="user-profile-github-username">
                {user.githubUsername}
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-item__label">User Database ID</div>
              <div className="meta-item__value mono" id="user-profile-db-id">
                {user._id}
              </div>
            </div>

            <div className="meta-item">
              <div className="meta-item__label">Member Since</div>
              <div className="meta-item__value" id="user-profile-joined">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
