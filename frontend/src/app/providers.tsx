"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import { normalizeAuthUser } from "@/lib/authUtils";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { setUser, setToken, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser && !isAuthenticated) {
      try {
        const user = normalizeAuthUser(JSON.parse(storedUser));
        setToken(token);
        setUser(user);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [isAuthenticated, setToken, setUser]);

  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AuthInitializer>{children}</AuthInitializer>
    </SessionProvider>
  );
}
