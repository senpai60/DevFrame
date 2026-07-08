import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to DevFrame — Developer Showcase Platform",
  description: "Sign in to DevFrame with GitHub to showcase your public repositories, connect with developers, and build your portfolio.",
};

export default function LoginPage() {
  return (
    <div className="auth-container">
      {/* Background Animated Glows */}
      <div className="auth-background">
        <div className="auth-glow-1"></div>
        <div className="auth-glow-2"></div>
      </div>

      <div className="auth-card">
        {/* Logo Icon */}
        <div className="auth-card__logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>

        {/* Heading */}
        <h1 className="auth-card__title">Welcome back</h1>
        <p className="auth-card__subtitle">
          Showcase your code, build your network, and grow together.
        </p>

        {/* Buttons Stack */}
        <div className="auth-buttons-stack">
          {/* GitHub OAuth Button */}
          <a
            id="btn-github-login"
            href="http://localhost:5000/api/v1/auth/github"
            className="btn-auth btn-github"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Continue with GitHub
          </a>

          {/* Divider */}
          <div className="auth-divider">or use dev bypass</div>

          {/* Developer Mock/Bypass Button */}
          <a
            id="btn-mock-login"
            href="http://localhost:5000/api/v1/auth/mock-login"
            className="btn-auth btn-mock"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m10 10-2 2 2 2" />
              <path d="m14 14 2-2-2-2" />
            </svg>
            Developer Mock Bypass
          </a>
        </div>

        {/* Footer */}
        <p className="auth-card__footer">
          By signing in, you agree to our <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}
