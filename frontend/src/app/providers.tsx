"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { useAuthStore } from "@/store/authStore";
import FloatingSupport from "@/components/common/FloatingSupport";
import { LanguageProvider } from "@/context/LanguageContext";

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
      <LanguageProvider>
        <AuthInitializer>
          {children}
          <FloatingSupport />
        </AuthInitializer>
      </LanguageProvider>
    </SessionProvider>
  );
}
