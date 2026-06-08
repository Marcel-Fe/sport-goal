/**
 * Globaler Logo-Store: löst pro Team-ID das echte Vereinslogo (Badge-URL) auf
 * und cacht es (Session + AsyncStorage über die API). So zeigen alle Wappen in
 * der App echte Logos, sobald verfügbar – sonst Platzhalter.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { API_TEAM_NAME, getTeamBadge } from '@/data/live';

interface BadgeCtx {
  badges: Record<string, string | undefined>;
  resolve: (teamId: string) => void;
}

const Ctx = createContext<BadgeCtx | undefined>(undefined);

export function BadgeProvider({ children }: { children: ReactNode }) {
  const [badges, setBadges] = useState<Record<string, string | undefined>>({});
  const [requested] = useState<Set<string>>(() => new Set());

  const resolve = (teamId: string) => {
    if (requested.has(teamId)) return;
    const apiName = API_TEAM_NAME[teamId];
    if (!apiName) return;
    requested.add(teamId);
    getTeamBadge(apiName).then((b) => {
      if (b) setBadges((prev) => ({ ...prev, [teamId]: b }));
    });
  };

  return <Ctx.Provider value={{ badges, resolve }}>{children}</Ctx.Provider>;
}

export function useBadge(teamId?: string): string | undefined {
  const ctx = useContext(Ctx);
  useEffect(() => {
    if (ctx && teamId) ctx.resolve(teamId);
  }, [ctx, teamId]);
  return teamId ? ctx?.badges[teamId] : undefined;
}
