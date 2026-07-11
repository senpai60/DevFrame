"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const attemptTokenRefresh = async (): Promise<string | null> => {
    try {
      const res = await fetch("http://localhost:5000/api/v1/auth/refresh", {
        method: "POST",
        credentials: "include", // send cookies
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
    router.replace("/login");
  };

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
        setError(null);
      } else if (res.status === 401) {
        const refreshedToken = await attemptTokenRefresh();
        if (refreshedToken) {
          await fetchProfile(refreshedToken);
        } else {
          redirectToLogin();
        }
      } else {
        throw new Error("Failed to fetch user profile");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async () => {
    try {
      const params = new URLSearchParams(window.location.search);
      let token = params.get("token");

      if (token) {
        localStorage.setItem("accessToken", token);
        // Clean URL parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        window.history.replaceState({}, document.title, url.pathname);
      } else {
        token = localStorage.getItem("accessToken");
      }

      if (!token) {
        const refreshed = await attemptTokenRefresh();
        if (refreshed) {
          token = refreshed;
        } else {
          redirectToLogin();
          return;
        }
      }

      await fetchProfile(token);
    } catch (err) {
      console.error("Auth initialization error:", err);
      setError("Failed to initialize session");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleAuth();
  }, []);

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:5000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      redirectToLogin();
    }
  };

  const refreshProfile = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await fetchProfile(token);
    }
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
          Loading DevFrame session...
        </p>
      </div>
    );
  }

  // Sidebar link config
  const links = [
    {
      name: "Feed",
      href: "/app",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      ),
    },
    {
      name: "Dashboard",
      href: "/app/dashboard",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
    },
    {
      name: "Repositories",
      href: "/app/repositories",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
    {
      name: "Explore",
      href: "/app/explore",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
    {
      name: "Profile",
      href: "/app/profile",
      icon: (
        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, refreshProfile }}>
      <div className="app-container">
        {/* Sidebar Slide Panel */}
        <aside className="app-sidebar">
          {/* Logo */}
          <Link href="/app" className="sidebar-logo">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>DevFrame</span>
          </Link>

          {/* Links */}
          <nav className="sidebar-nav">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${isActive ? "active" : ""}`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="sidebar-user">
            {user && (
              <div className="sidebar-profile-info">
                <img
                  src={user.avatar || "https://avatars.githubusercontent.com/u/583231?v=4"}
                  alt={user.name || user.username}
                  className="sidebar-avatar"
                />
                <div className="sidebar-user-details">
                  <span className="sidebar-user-name">{user.name || "Developer"}</span>
                  <span className="sidebar-user-handle">@{user.username || user.githubUsername}</span>
                </div>
              </div>
            )}
            <button className="sidebar-logout-btn" onClick={logout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="app-content">{children}</main>
      </div>
    </AuthContext.Provider>
  );
}
