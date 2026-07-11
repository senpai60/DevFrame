"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect preserving any query params (like tokens)
    const search = window.location.search;
    router.replace(`/app/dashboard${search}`);
  }, [router]);

  return (
    <div className="loading-wrapper" style={{ display: "flex", flexDirection: "column", height: "100vh", alignItems: "center", justifyContent: "center", gap: "var(--space-4)", background: "var(--color-bg)" }}>
      <div className="spinner"></div>
      <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
        Redirecting to dashboard...
      </p>
    </div>
  );
}
