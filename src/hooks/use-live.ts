/**
 * Lädt echte Liga-Daten (Tabelle, letzte Ergebnisse, nächste Spiele) für eine Liga
 * und ein echtes Vereinslogo für ein Team. Mit Lade- und "live"-Status.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
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

import { fetchClubNews, type NewsHeadline } from '@/data/news';

export function useClubNews(
  teamId?: string,
  query?: string,
): { loading: boolean; items: NewsHeadline[] | null } {
  const [state, setState] = useState<{ loading: boolean; items: NewsHeadline[] | null }>({
    loading: false,
    items: null,
  });
  useEffect(() => {
    let alive = true;
    if (!query && !teamId) {
      setState({ loading: false, items: null });
      return;
    }
    setState({ loading: true, items: null });
    fetchClubNews(query ?? '', teamId).then((items) => {
      if (alive) setState({ loading: false, items });
    });
    return () => {
      alive = false;
    };
  }, [teamId, query]);
  return state;
}

import { getTeam } from '@/data/teams';

export interface FavNewsItem extends NewsHeadline {
  teamId: string;
}

/**
 * Lädt echte News für alle Favoriten parallel, taggt jede Schlagzeile mit ihrem
 * teamId (für das richtige Logo) und mischt sie nach Aktualität. Fallback = null.
 */
export function useFavoritesNews(
  teamIds: string[],
): { loading: boolean; items: FavNewsItem[] | null } {
  const [state, setState] = useState<{ loading: boolean; items: FavNewsItem[] | null }>({
    loading: false,
    items: null,
  });
  const key = teamIds.join(',');
  useEffect(() => {
    let alive = true;
    if (!teamIds.length) {
      setState({ loading: false, items: null });
      return;
    }
    setState({ loading: true, items: null });
    (async () => {
      const lists = await Promise.all(
        teamIds.map(async (id) => {
          const items = await fetchClubNews(getTeam(id)?.name ?? '', id);
          return (items ?? []).map((it) => ({ ...it, teamId: id }));
        }),
      );
      if (!alive) return;
      const merged = lists.flat().sort((a, b) => b.pub - a.pub);
      setState({ loading: false, items: merged.length ? merged : null });
    })();
    return () => {
      alive = false;
    };
    // key fasst die Favoritenliste stabil zusammen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

/** Erkennt Transfer-/Wechsel-Schlagzeilen (DE + EN). */
const TRANSFER_RE =
  /transfer|wechsel|ger[üu]cht|verpflicht|abl[öo]se|leihe|deal|vertrag|interesse|poker|abgang|zugang|verkauf|holt|trade[ds]?|sign(s|ing|ed)?/i;

/**
 * Wie useFavoritesNews, aber nur Transfer-/Wechsel-Schlagzeilen der Favoriten.
 * Nutzt die vorhandenen Vereins-Feeds (kein extra Cron). Fallback = null.
 */
export function useFavoritesTransfers(
  teamIds: string[],
): { loading: boolean; items: FavNewsItem[] | null } {
  const [state, setState] = useState<{ loading: boolean; items: FavNewsItem[] | null }>({
    loading: false,
    items: null,
  });
  const key = teamIds.join(',');
  useEffect(() => {
    let alive = true;
    if (!teamIds.length) {
      setState({ loading: false, items: null });
      return;
    }
    setState({ loading: true, items: null });
    (async () => {
      const lists = await Promise.all(
        teamIds.map(async (id) => {
          const items = await fetchClubNews(getTeam(id)?.name ?? '', id);
          return (items ?? [])
            .filter((it) => TRANSFER_RE.test(it.title))
            .map((it) => ({ ...it, teamId: id }));
        }),
      );
      if (!alive) return;
      const merged = lists.flat().sort((a, b) => b.pub - a.pub);
      setState({ loading: false, items: merged.length ? merged : null });
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state;
}

import { fetchFeed } from '@/data/news';

/** Lädt einen festen, same-origin Feed nach id (z. B. 'all', 'transfers'). */
export function useFeed(id: string): { loading: boolean; items: NewsHeadline[] | null } {
  const [state, setState] = useState<{ loading: boolean; items: NewsHeadline[] | null }>({
    loading: true,
    items: null,
  });
  useEffect(() => {
    let alive = true;
    fetchFeed(id).then((items) => {
      if (alive) setState({ loading: false, items });
    });
    return () => {
      alive = false;
    };
  }, [id]);
  return state;
}

/**
 * Stabile Form: nutzt die frische Live-Form, merkt sie sich aber persistent. Liefert
 * die API mal keine Form (freier Key schwankt), bleibt die zuletzt bekannte erhalten.
 */
export function usePersistentForm(teamId: string | undefined, liveForm: string): string {
  const [form, setForm] = useState(liveForm);
  useEffect(() => {
    let alive = true;
    const key = 'form:' + (teamId ?? '');
    if (liveForm && liveForm.length > 0) {
      setForm(liveForm);
      AsyncStorage.setItem(key, liveForm).catch(() => {});
    } else if (teamId) {
      AsyncStorage.getItem(key).then((v) => {
        if (alive && v) setForm(v);
      });
    } else {
      setForm('');
    }
    return () => {
      alive = false;
    };
  }, [teamId, liveForm]);
  return form;
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
