/**
 * Echte, aktuelle Vereins-News über Google-News-RSS (pro Verein als Suchanfrage).
 * Da GitHub Pages kein Backend hat, läuft der Abruf über öffentliche CORS-Proxys
 * (mehrere als Fallback). Gezeigt werden nur Überschrift + Quelle + Link (legal).
 * Schlägt alles fehl → null, die App fällt auf KI-Zusammenfassungen zurück.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const TTL = 15 * 60 * 1000;

export interface NewsHeadline {
  title: string;
  link: string;
  source: string;
  ago: string;
  pub: number;
}

function proxies(target: string): { url: string; json: boolean }[] {
  const enc = encodeURIComponent(target);
  return [
    // corsproxy.io funktioniert im echten Browser (sendet Origin-Header)
    { url: `https://corsproxy.io/?url=${enc}`, json: false },
    { url: `https://api.allorigins.win/get?url=${enc}`, json: true },
    { url: `https://api.codetabs.com/v1/proxy/?quest=${enc}`, json: false },
    { url: `https://thingproxy.freeboard.io/fetch/${target}`, json: false },
    { url: `https://api.allorigins.win/raw?url=${enc}`, json: false },
  ];
}

function ago(pub: number): string {
  const min = Math.max(1, Math.round((Date.now() - pub) / 60000));
  if (min < 60) return `vor ${min} Min.`;
  const h = Math.round(min / 60);
  if (h < 24) return `vor ${h} Std.`;
  return `vor ${Math.round(h / 24)} Tg.`;
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function parseRss(xml: string): NewsHeadline[] {
  const items = xml.split('<item>').slice(1);
  const out: NewsHeadline[] = [];
  for (const raw of items.slice(0, 12)) {
    const title = decode((raw.match(/<title>(.*?)<\/title>/s)?.[1] ?? '').trim());
    const link = decode((raw.match(/<link>(.*?)<\/link>/s)?.[1] ?? '').trim());
    const pubStr = raw.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1] ?? '';
    const srcTag = decode((raw.match(/<source[^>]*>(.*?)<\/source>/s)?.[1] ?? '').trim());
    if (!title || !link) continue;
    // Google-News-Titel: "Headline - Publisher"
    let head = title;
    let source = srcTag;
    const dash = title.lastIndexOf(' - ');
    if (!source && dash > 0) {
      source = title.slice(dash + 3);
      head = title.slice(0, dash);
    }
    const pub = pubStr ? new Date(pubStr).getTime() : Date.now();
    out.push({ title: head, link, source: source || 'Quelle', pub, ago: ago(pub) });
  }
  return out;
}

async function fetchVia(p: { url: string; json: boolean }): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(p.url, { signal: ctrl.signal });
    clearTimeout(to);
    if (!res.ok) return null;
    if (p.json) {
      const j = await res.json();
      return j?.contents ?? null;
    }
    return await res.text();
  } catch {
    return null;
  }
}

/** Basis-Pfad der App (z. B. /sport-goal) für same-origin Datendateien. */
function siteBase(): string {
  if (typeof window !== 'undefined' && window.location) {
    const parts = window.location.pathname.split('/');
    if (parts[1]) return '/' + parts[1];
  }
  return '';
}

/** Frische News aus der vom Cron erzeugten festen Datei (same-origin, zuverlässig). */
async function fetchStatic(teamId: string): Promise<NewsHeadline[] | null> {
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(`${siteBase()}/news/${teamId}.json?t=${Date.now()}`, {
      signal: ctrl.signal,
    });
    clearTimeout(to);
    if (!res.ok) return null;
    const data = await res.json();
    const items = (data?.items ?? []).map((it: any) => ({
      title: it.title,
      link: it.link,
      source: it.source ?? 'Quelle',
      pub: it.pub ?? Date.now(),
      ago: ago(it.pub ?? Date.now()),
    }));
    return items.length ? items : null;
  } catch {
    return null;
  }
}

export async function fetchClubNews(
  query: string,
  teamId?: string,
): Promise<NewsHeadline[] | null> {
  // 1) Beste Quelle: feste, vom Cron frisch gehaltene Datei (same-origin, kein CORS)
  if (teamId) {
    const stat = await fetchStatic(teamId);
    if (stat) return stat;
  }

  const target = `https://news.google.com/rss/search?q=${encodeURIComponent(
    query,
  )}&hl=de&gl=DE&ceid=DE:de`;
  const ck = 'news:' + query;

  // frischer Cache?
  try {
    const raw = await AsyncStorage.getItem(ck);
    if (raw) {
      const { t, d } = JSON.parse(raw);
      if (Date.now() - t < TTL && d?.length) return d as NewsHeadline[];
    }
  } catch {}

  for (const p of proxies(target)) {
    const xml = await fetchVia(p);
    if (xml && xml.includes('<item>')) {
      const items = parseRss(xml);
      if (items.length) {
        AsyncStorage.setItem(ck, JSON.stringify({ t: Date.now(), d: items })).catch(() => {});
        return items;
      }
    }
  }

  // abgelaufener Cache als Notnagel
  try {
    const raw = await AsyncStorage.getItem(ck);
    if (raw) {
      const d = JSON.parse(raw).d;
      if (d?.length) return d as NewsHeadline[];
    }
  } catch {}
  return null;
}
