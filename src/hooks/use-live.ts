/**
 * Lädt echte Liga-Daten (Tabelle, letzte Ergebnisse, nächste Spiele) für eine Liga
 * und ein echtes Vereinslogo für ein Team. Mit Lade- und "live"-Status.
 */
import { useEffect, useState } from 'react';

import {
  API_TEAM_NAME,
  getNext,
  getPast,
  getTable,
  getTeamBadge,
  leagueSupported,
  type LiveMatch,
  type LiveStanding,
} from '@/data/live';

export interface LiveLeagueState {
  loading: boolean;
  supported: boolean;
  live: boolean;
  table: LiveStanding[] | null;
  past: LiveMatch[] | null;
  next: LiveMatch[] | null;
}

const INITIAL: LiveLeagueState = {
  loading: false,
  supported: false,
  live: false,
  table: null,
  past: null,
  next: null,
};

export function useLiveLeague(league?: string): LiveLeagueState {
  const [state, setState] = useState<LiveLeagueState>(INITIAL);

  useEffect(() => {
    let alive = true;
    if (!leagueSupported(league)) {
      setState({ ...INITIAL, supported: false });
      return;
    }
    setState({ ...INITIAL, supported: true, loading: true });
    (async () => {
      const [table, past, next] = await Promise.all([
        getTable(league!),
        getPast(league!),
        getNext(league!),
      ]);
      if (!alive) return;
      setState({
        loading: false,
        supported: true,
        live: !!(table || past || next),
        table,
        past,
        next,
      });
    })();
    return () => {
      alive = false;
    };
  }, [league]);

  return state;
}

export function useTeamBadge(teamId?: string): string | undefined {
  const [badge, setBadge] = useState<string | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    const apiName = teamId ? API_TEAM_NAME[teamId] : undefined;
    if (!apiName) {
      setBadge(undefined);
      return;
    }
    getTeamBadge(apiName).then((b) => {
      if (alive) setBadge(b);
    });
    return () => {
      alive = false;
    };
  }, [teamId]);
  return badge;
}
