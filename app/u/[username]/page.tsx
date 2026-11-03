"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import { useAuth } from "@/hooks/useAuth";
import { profileCompletionApi } from "@/lib/profileCompletion";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileInterests } from "@/components/profile/ProfileInterests";
import { BadgeShelf } from "@/components/profile/BadgeShelf";
import { ProfileDesireGrid } from "@/components/profile/ProfileDesireGrid";
import { ProfileStatButtons } from "@/components/profile/ProfileStatButtons";
import { ReportButton } from "@/components/report/ReportButton";
import { PinButton } from "@/components/people/PinButton";
import type { ProfileDesire, PublicStats } from "@/types/profileCompletion";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const { user } = useAuth();
  const { profile, isLoading, error, reload } = usePublicProfile(params.username);
  const [desires, setDesires] = useState<ProfileDesire[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [extrasLoading, setExtrasLoading] = useState(true);
  const [extrasError, setExtrasError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      setExtrasError("");
      try {
        const [nextDesires, nextStats] = await Promise.all([
          profileCompletionApi.desires(params.username, 50),
          profileCompletionApi.stats(params.username),
        ]);
        if (active) {
          setDesires(nextDesires);
          setStats(nextStats);
        }
      } catch (caught) {
        if (active) {
          setExtrasError(caught instanceof Error ? caught.message : "Could not load desires.");
        }
      } finally {
        if (active) setExtrasLoading(false);
      }
    });

    return () => { active = false; };
  }, [params.username]);

  if (isLoading) {
    return <main className="public-profile-shell"><div className="public-profile-loading" /></main>;
  }

  if (error || !profile) {
    return (
      <main className="public-profile-shell">
        <section className="public-profile-error">
          <span className="eyebrow">PROFILE UNAVAILABLE</span>
          <h1>Nothing to show.</h1>
          <p>{error}</p>
          <button className="button" onClick={() => void reload()}>Try again</button>
        </section>
      </main>
    );
  }

  const own =
    profile.userId === user?.id ||
    profile.username.toLowerCase() === user?.username?.toLowerCase();

  return (
    <main className="public-profile-shell">
      <nav className="public-profile-nav">
        <Link href="/feed">← Feed</Link>
        <span>@{profile.username}</span>
        {!own && (
          <div className="public-profile-actions">
            <PinButton userId={profile.userId} />
            <ReportButton
              reportedUserId={profile.userId}
              targetLabel={`@${profile.username}`}
            />
          </div>
        )}
      </nav>

      <ProfileHero profile={profile} />
      <ProfileStatButtons
        desires={desires}
        totalWants={profile.totalWantsGenerated}
        totalDesires={profile.desiresPosted}
        ownerLabel={profile.displayName || profile.username}
        globalRank={stats?.globalRank}
      />
      <ProfileInterests profile={profile} />
      <BadgeShelf profile={profile} />

      <section className="profile-desires-section">
        <div className="section-line">
          <h2>Desires</h2>
          <span>{desires.length} shown</span>
        </div>
        {extrasError && <p className="form-error">{extrasError}</p>}
        {extrasLoading ? (
          <div className="public-profile-loading" />
        ) : (
          <ProfileDesireGrid items={desires} />
        )}
      </section>
    </main>
  );
}
