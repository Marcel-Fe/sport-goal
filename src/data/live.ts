/**
 * Echte, aktuelle Sportdaten über die kostenlose, lizenzierte API von TheSportsDB.
 * Liefert Tabelle, letzte Ergebnisse, nächste Spiele + echte Vereinslogos (Badges)
 * und – wo vorhanden – offizielle Highlight-Video-Links.
 *
 * Rechtlich: TheSportsDB lizenziert Logos/Daten für App-Nutzung; Videos werden nur
 * als Bild + Link (offizielle Quelle) gezeigt, nicht kopiert.
 *
 * Robust: kurzer Timeout, AsyncStorage-Cache (Offline + API-Limits), Fallback = null.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import { TEAM_DB_ID } from '@/data/team-ids';

const KEY = '3'; // öffentlicher Test-Key (kostenlos)
const BASE = `https://www.thesportsdb.com/api/v1/json/${KEY}`;
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 Min

/** Meine Liga-Namen → TheSportsDB Liga-ID + Saison. hasTable=false bei Einzelsport. */
export const LIVE_LEAGUES: Record<string, { id: string; season: string; hasTable: boolean }> = {
  Bundesliga: { id: '4331', season: '2025-2026', hasTable: true },
  'Premier League': { id: '4328', season: '2025-2026', hasTable: true },
  'La Liga': { id: '4335', season: '2025-2026', hasTable: true },
  NBA: { id: '4387', season: '2025-2026', hasTable: true },
  NFL: { id: '4391', season: '2025', hasTable: true },
  'Formel 1': { id: '4370', season: '2025-2026', hasTable: false },
};

export function leagueSupported(league?: string): boolean {
  return !!(league && LIVE_LEAGUES[league]);
}

/** Meine Team-IDs → exakter Name bei TheSportsDB (für Logo-Suche & Tabellen-Highlight). */
export const API_TEAM_NAME: Record<string, string> = {
  bayern: 'Bayern Munich', dortmund: 'Borussia Dortmund', leverkusen: 'Bayer Leverkusen',
  stuttgart: 'VfB Stuttgart', leipzig: 'RB Leipzig', wolfsburg: 'VfL Wolfsburg', frankfurt: 'Eintracht Frankfurt',
  liverpool: 'Liverpool', mancity: 'Manchester City', arsenal: 'Arsenal', astonvilla: 'Aston Villa',
  realmadrid: 'Real Madrid', barcelona: 'Barcelona', atletico: 'Atletico Madrid',
  lakers: 'Los Angeles Lakers', celtics: 'Boston Celtics', warriors: 'Golden State Warriors', nuggets: 'Denver Nuggets',
  chiefs: 'Kansas City Chiefs', eagles: 'Philadelphia Eagles', niners: 'San Francisco 49ers',
  bills: 'Buffalo Bills', cowboys: 'Dallas Cowboys', ravens: 'Baltimore Ravens',
};

/** Loser Namensvergleich (API-Name ↔ Tabellenzeile). */
export function sameTeam(rowName: string, apiName?: string): boolean {
  if (!apiName) return false;
  const a = rowName.toLowerCase();
  const b = apiName.toLowerCase();
  return a === b || a.includes(b) || b.includes(a);
}

export interface LiveStanding {
  rank: number;
  name: string;
  badge?: string;
  played: number;
  points: number;
  form?: string;
}

export interface LiveMatch {
  id: string;
  ts?: string;
  dateLabel: string;
  timeLabel: string;
  home?: string;
  away?: string;
  event?: string; // Einzel-Event (F1-Rennen, Tennis-Match) ohne Heim/Gast
  homeBadge?: string;
  awayBadge?: string;
  homeScore?: string;
  awayScore?: string;
  league: string;
  finished: boolean;
  video?: string;
  thumb?: string;
}

/** '/tiny' am Badge entfernen → größere Auflösung (für Hero). */
export function bigBadge(url?: string): string | undefined {
  return url ? url.replace('/tiny', '') : undefined;
}

async function cached<T>(url: string): Promise<T | null> {
  const ck = 'live:' + url;
  // 1) frischer Cache?
  try {
    const raw = await AsyncStorage.getItem(ck);
    if (raw) {
      const { t, d } = JSON.parse(raw);
      if (Date.now() - t < CACHE_TTL_MS) return d as T;
    }
  } catch {}
  // 2) Netzwerk
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(to);
    if (!res.ok) throw new Error('http ' + res.status);
    const json = (await res.json()) as T;
    AsyncStorage.setItem(ck, JSON.stringify({ t: Date.now(), d: json })).catch(() => {});
    return json;
  } catch {
    // 3) abgelaufener Cache als Notnagel
    try {
      const raw = await AsyncStorage.getItem(ck);
      if (raw) return JSON.parse(raw).d as T;
    } catch {}
    return null;
  }
}

function fmtDate(ts?: string): { dateLabel: string; timeLabel: string } {
  if (!ts) return { dateLabel: '', timeLabel: '' };
  const d = new Date(ts);
  if (isNaN(d.getTime())) return { dateLabel: ts.slice(0, 10), timeLabel: '' };
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    dateLabel: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`,
    timeLabel: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

export async function getTable(league: string): Promise<LiveStanding[] | null> {
  const cfg = LIVE_LEAGUES[league];
  if (!cfg || !cfg.hasTable) return null;
  const data = await cached<{ table?: any[] }>(
    `${BASE}/lookuptable.php?l=${cfg.id}&s=${cfg.season}`,
  );
  if (!data?.table?.length) return null;
  return data.table.map((r) => ({
    rank: Number(r.intRank),
    name: r.strTeam,
    badge: r.strBadge,
    played: Number(r.intPlayed),
    points: Number(r.intPoints),
    form: r.strForm,
  }));
}

function mapEvents(events: any[] | undefined, finished: boolean): LiveMatch[] {
  if (!events?.length) return [];
  return events.map((e) => ({
    id: e.idEvent,
    ts: e.strTimestamp,
    ...fmtDate(e.strTimestamp),
    home: e.strHomeTeam || undefined,
    away: e.strAwayTeam || undefined,
    event: e.strEvent || undefined,
    homeBadge: e.strHomeTeamBadge,
    awayBadge: e.strAwayTeamBadge,
    homeScore: e.intHomeScore ?? undefined,
    awayScore: e.intAwayScore ?? undefined,
    league: e.strLeague,
    finished,
    video: e.strVideo || undefined,
    thumb: e.strThumb || undefined,
  }));
}

export async function getPast(league: string): Promise<LiveMatch[] | null> {
  const cfg = LIVE_LEAGUES[league];
  if (!cfg) return null;
  const data = await cached<{ events?: any[] }>(`${BASE}/eventspastleague.php?id=${cfg.id}`);
  if (!data) return null;
  return mapEvents(data.events, true);
}

export async function getNext(league: string): Promise<LiveMatch[] | null> {
  const cfg = LIVE_LEAGUES[league];
  if (!cfg) return null;
  const data = await cached<{ events?: any[] }>(`${BASE}/eventsnextleague.php?id=${cfg.id}`);
  if (!data) return null;
  return mapEvents(data.events, false);
}

/** Letzte echte Spiele EINES Vereins (teamspezifisch). Key "results", nicht "events". */
export async function getTeamLast(teamId: string): Promise<LiveMatch[] | null> {
  const dbId = TEAM_DB_ID[teamId];
  if (!dbId) return null;
  const data = await cached<{ results?: any[] }>(`${BASE}/eventslast.php?id=${dbId}`);
  if (!data?.results?.length) return null;
  return mapEvents(data.results, true);
}

/**
 * Form (W/D/L) aus den echten letzten Spielen eines Teams berechnen – Fallback,
 * wenn die API kein strForm liefert. Reihenfolge: ältestes → neuestes (rechts neu).
 */
export function deriveForm(
  past: LiveMatch[] | null,
  apiName?: string,
  max = 5,
): string {
  if (!past || !apiName) return '';
  const valid = (s?: string) => s != null && s !== '' && !isNaN(Number(s));
  const mine = past.filter(
    (m) =>
      (sameTeam(m.home ?? '', apiName) || sameTeam(m.away ?? '', apiName)) &&
      valid(m.homeScore) &&
      valid(m.awayScore),
  );
  // past ist neueste-zuerst → letzte `max` Spiele, dann chronologisch drehen
  return mine
    .slice(0, max)
    .reverse()
    .map((m) => {
      const home = sameTeam(m.home ?? '', apiName);
      const gf = Number(home ? m.homeScore : m.awayScore);
      const ga = Number(home ? m.awayScore : m.homeScore);
      return gf > ga ? 'W' : gf < ga ? 'L' : 'D';
    })
    .join('');
}

/** Echtes Logo zu einem Team-Namen (für Hero/Listen). */
export async function getTeamBadge(apiName: string): Promise<string | undefined> {
  const data = await cached<{ teams?: any[] }>(
    `${BASE}/searchteams.php?t=${encodeURIComponent(apiName)}`,
  );
  return data?.teams?.[0]?.strBadge ?? undefined;
}
