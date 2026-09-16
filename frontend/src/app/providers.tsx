"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import FloatingSupport from "@/components/common/FloatingSupport";

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { hydrateSession } = useAuthStore();

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  return <>{children}</>;
}

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
      <AuthInitializer>
        {children}
        <FloatingSupport />
      </AuthInitializer>
    </SessionProvider>
  );
}

