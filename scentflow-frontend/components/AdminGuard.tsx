"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginPage) return;

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    if (user.app_metadata?.role !== "admin") {
      router.replace("/");
    }
  }, [loading, user, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (loading) return <div className="min-h-screen bg-slate-950" />;
  if (!user || user.app_metadata?.role !== "admin") return null;

  return <>{children}</>;
}
