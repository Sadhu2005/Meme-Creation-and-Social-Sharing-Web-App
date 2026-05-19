"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/auth-context";

export default function ProfileMePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user?.pet_name) {
      router.replace(`/profile/${user.pet_name}`);
    } else {
      router.replace("/sign-in");
    }
  }, [user, loading, router]);

  return (
    <p className="text-center text-[var(--color-muted)]">Loading your profile…</p>
  );
}
