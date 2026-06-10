import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Frame from '@/components/Frame';
import ClubBento from '@/components/ClubBento';
import HeadlineCarousel from '@/components/HeadlineCarousel';
import HeroCard from '@/components/HeroCard';
import Ticker from '@/components/Ticker';
import {
  EventRow,
  LiveRow,
  NewsCompact,
  NewsFeatured,
  ShortCard,
  StandingsTable,
  TransferRow,
  TrendingRow,
  VideoCompact,
  VideoFeatured,
} from '@/components/cards';
import {
  LiveFixtureRow,
  LiveNewsFeatured,
  LiveNewsRow,
  LiveResultRow,
  LiveStandingsTable,
  LiveVideoCard,
} from '@/components/live-cards';
import { Card, LiveDot, SectionHeader } from '@/components/primitives';
import { C, F, R, S } from '@/constants/tokens';
import {
  byFavorites,
  EVENTS,
  heroTilesFor,
  LIVE_EVENTS,
  NEWS,
  SHORTS,
  SPORT_CONFIG,
  standingsForLeague,
  TRANSFERS,
  TRENDING,
  VIDEOS,
} from '@/data/mock';
import { API_TEAM_NAME, deriveForm, sameTeam } from '@/data/live';
import { badgeUrl } from '@/data/badges-static';
import { shopUrl } from '@/data/shops';
import { getTeam } from '@/data/teams';
import {
  useClubNews,
  useFavoritesTransfers,
  useFeed,
  useLiveLeague,
  usePersistentForm,
} from '@/hooks/use-live';
import { useFavorites } from '@/store/favorites';

function AppHeader({ teamId }: { teamId?: string }) {
  const team = teamId ? getTeam(teamId) : undefined;
  return (
    <View style={styles.appHeader}>
      <Text style={styles.logo}>
        SPORT <Text style={{ color: C.accent }}>GOAL</Text>
      </Text>
      <View style={styles.headerRight}>
        <View style={styles.bellWrap}>
          <Text style={styles.headerIcon}>🔔</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </View>
        <View style={styles.profileChip}>
          <Text style={styles.profileText} numberOfLines={1}>
            {team ? `${team.initials}-Fan` : 'Fan'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function Dashboard() {
  const { favorites, primaryTeamId } = useFavorites();
  const teamId = primaryTeamId ?? 'bayern';
  const team = getTeam(teamId);
  const sport = team?.sport ?? 'football';
  const cfg = SPORT_CONFIG[sport];
  const { sports, teamIds } = favorites;

  // Echte Live-Daten der Liga (Tabelle, Ergebnisse, Spiele) + echtes Logo
  const liveData = useLiveLeague(team?.league);
  const clubNews = useClubNews(teamId, team?.name);
  const worldNews = useFeed('all');
  const transferNews = useFeed('transfers');
  const favTransfers = useFavoritesTransfers(teamIds);
  const heroBadge = badgeUrl(teamId);
  const apiName = teamId ? API_TEAM_NAME[teamId] : undefined;
  const liveRow = liveData.table?.find((r) => sameTeam(r.name, apiName));

  // Bento-Daten (echt wo möglich, sonst Demo) + Vereinsfarbe
  const mockStanding = standingsForLeague(team?.league).find((s) => s.teamId === teamId);
  const nextTile = heroTilesFor(teamId)[0];
  const clubColor = team?.colors?.[0] ?? C.accent;
  // Form: echtes API-Feld, sonst aus letzten Spielen berechnet – persistent gemerkt.
  const clubForm = usePersistentForm(teamId, liveRow?.form || deriveForm(liveData.past, apiName));

  // Transferticker: Gerüchte der Favoriten zuerst, sonst allgemeiner Feed.
  const favTx = favTransfers.items?.length ? favTransfers.items : null;
  const tickerTransfers = favTx ?? (transferNews.items?.length ? transferNews.items : null);

  // Demo-Feeds nach Favoriten
  const news = byFavorites(NEWS, sports, teamIds);
  const shorts = byFavorites(SHORTS, sports, teamIds);
  const demoVideos = byFavorites(VIDEOS, sports, teamIds);
  const transfers = byFavorites(TRANSFERS, sports, teamIds).slice(0, 4);

  // Echte Ergebnisse / Spiele / Highlights (sonst Demo)
  const results = liveData.past ?? [];
  const fixtures = liveData.next ?? [];
  // Spielfreie Zeit (keine kommenden Spiele): ehrliches Label, kein Live-Punkt.
  const hasUpcoming = fixtures.length > 0;
  const resultsTitle = hasUpcoming ? 'AKTUELLE ERGEBNISSE' : 'LETZTE ERGEBNISSE';
  // Highlights nur vom eigenen Verein (sonst fremde Liga-Spiele) – Fallback: Demo-Videos.
  const teamResults = apiName
    ? results.filter((m) => sameTeam(m.home ?? '', apiName) || sameTeam(m.away ?? '', apiName))
    : results;
  const highlights = teamResults.filter((m) => m.video || m.thumb).slice(0, 8);
  const demoEvents = byFavorites(EVENTS, sports, teamIds).slice(0, 6);

  const liveScore = (e: (typeof LIVE_EVENTS)[number]) =>
    (teamIds.includes(e.homeId) || teamIds.includes(e.awayId) ? 2 : 0) +
    (sports.includes(e.sport) ? 1 : 0);
  const demoLive = [...LIVE_EVENTS].sort((a, b) => liveScore(b) - liveScore(a));

  const trending = [...TRENDING]
    .sort(
      (a, b) =>
        (b.sport && sports.includes(b.sport) ? 1 : 0) -
        (a.sport && sports.includes(a.sport) ? 1 : 0),
    )
    .slice(0, 5);

  const featuredNews = news[0];
  const sideNews = news.slice(1, 4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={['rgba(226,0,26,0.14)', 'rgba(226,0,26,0.0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.ambient}
        pointerEvents="none"
      />
      <Frame>
      <AppHeader teamId={teamId} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Suche nach Teams, Spielern, News…</Text>
        </View>

        <HeroCard
          teamId={teamId}
          badgeUri={heroBadge}
          rank={liveRow?.rank}
          points={liveRow?.points}
          showTiles={false}
        />

        {/* Bento-Grid: Schlüsselzahlen in Vereinsfarbe */}
        <ClubBento
          primary={clubColor}
          rank={liveRow?.rank ?? mockStanding?.pos}
          points={liveRow?.points ?? mockStanding?.points}
          played={liveRow?.played}
          form={clubForm}
          nextValue={nextTile?.value ?? '—'}
          nextSub={nextTile?.sub ?? 'kein Termin'}
          league={team?.league}
        />

        {/* Rund um den Verein: offizieller Fanshop (nur Link) */}
        <Pressable
          style={styles.shopLink}
          onPress={() => Linking.openURL(shopUrl(teamId)).catch(() => {})}
        >
          <Text style={styles.shopIcon}>🛒</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.shopTitle}>Offizieller Fanshop</Text>
            <Text style={styles.shopSub} numberOfLines={1}>
              Trikots & Fanartikel {team ? `von ${team.name}` : ''}
            </Text>
          </View>
          <Text style={styles.shopChevron}>›</Text>
        </Pressable>

        {/* Schlagzeilen der ganzen Sportwelt – durchklickbar (Bild-Stil) */}
        {worldNews.items && worldNews.items.length > 0 ? (
          <HeadlineCarousel items={worldNews.items} label="SCHLAGZEILEN" />
        ) : null}

        {/* AKTUELLE ERGEBNISSE (echt) – sonst Demo-Live */}
        {results.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.liveHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.sectionTitle}>{resultsTitle}</Text>
                {hasUpcoming ? <LiveDot label="LIVE-DATEN" /> : null}
              </View>
              <Text style={styles.actionMuted}>{team?.league}</Text>
            </View>
            <Card>
              {results.slice(0, 6).map((m, i) => (
                <View key={m.id}>
                  {i > 0 ? <View style={styles.rowDivider} /> : null}
                  <LiveResultRow item={m} />
                </View>
              ))}
            </Card>
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.liveHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.sectionTitle}>LIVE JETZT</Text>
                <LiveDot />
              </View>
              <Text style={styles.actionMuted}>Alle Events ›</Text>
            </View>
            <Card>
              {demoLive.map((e) => (
                <LiveRow key={e.id} item={e} />
              ))}
            </Card>
          </View>
        )}

        {/* TABELLE / WERTUNG – echt wo möglich */}
        <View style={styles.section}>
          <SectionHeader title={cfg.standingsTitle} actionLabel="Komplett" />
          <Card>
            <Text style={styles.tableCaption}>
              {team?.league}
              {liveData.table ? '  ·  aktuell' : ''}
            </Text>
            {liveData.table ? (
              <LiveStandingsTable
                rows={liveData.table}
                highlightApiName={apiName}
                col1={cfg.col1}
                col2={cfg.col2}
              />
            ) : (
              <StandingsTable
                rows={standingsForLeague(team?.league)}
                highlightId={teamId}
                col1={cfg.col1}
                col2={cfg.col2}
              />
            )}
          </Card>
        </View>

        {/* HIGHLIGHT-VIDEOS (echte Links) – sonst Demo-Videos */}
        {highlights.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="HIGHLIGHTS" actionLabel={null} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: S.md, paddingRight: S.lg }}
            >
              {highlights.map((m) => (
                <LiveVideoCard key={m.id} item={m} />
              ))}
            </ScrollView>
          </View>
        ) : demoVideos.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="AKTUELLE VIDEOS" />
            <Card>
              <VideoFeatured item={demoVideos[0]} />
              {demoVideos.length > 1 ? <View style={styles.divider} /> : null}
              <View style={{ gap: S.md }}>
                {demoVideos.slice(1, 4).map((v) => (
                  <VideoCompact key={v.id} item={v} />
                ))}
              </View>
            </Card>
          </View>
        ) : null}

        {/* TOP NEWS – echte Schlagzeilen (Quelle verlinkt), sonst KI-Zusammenfassungen */}
        {clubNews.items && clubNews.items.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title={`NEWS · ${team?.name ?? ''}`} actionLabel={null} />
            <Card>
              <LiveNewsFeatured item={clubNews.items[0]} teamId={teamId} />
              {clubNews.items.length > 1 ? <View style={styles.divider} /> : null}
              <View style={{ gap: S.lg }}>
                {clubNews.items.slice(1, 6).map((n, i) => (
                  <View key={i}>
                    {i > 0 ? <View style={styles.rowDivider} /> : null}
                    <View style={{ paddingTop: i > 0 ? S.md : 0 }}>
                      <LiveNewsRow item={n} teamId={teamId} />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ) : featuredNews ? (
          <View style={styles.section}>
            <SectionHeader title="TOP NEWS" onPress={() => router.push('/news')} />
            <Card>
              <NewsFeatured item={featuredNews} />
              {sideNews.length > 0 ? <View style={styles.divider} /> : null}
              <View style={{ gap: S.md }}>
                {sideNews.map((n) => (
                  <NewsCompact key={n.id} item={n} />
                ))}
              </View>
            </Card>
          </View>
        ) : null}

        {/* KURZE CLIPS */}
        {shorts.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="KURZE CLIPS" actionLabel="Mehr" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: S.md, paddingRight: S.lg }}
            >
              {shorts.map((s) => (
                <ShortCard key={s.id} item={s} />
              ))}
            </ScrollView>
          </View>
        ) : null}

        {/* TRANSFERGERÜCHTE – Favoriten zuerst, sonst allgemein, sonst Demo */}
        {tickerTransfers ? (
          <View style={styles.section}>
            <SectionHeader
              title={favTx ? `TRANSFERS · ${team?.name ?? ''}` : 'TRANSFERGERÜCHTE'}
              actionLabel={null}
            />
            <View style={styles.tickerBox}>
              <Ticker items={tickerTransfers} label="TRANSFERS" />
            </View>
          </View>
        ) : cfg.showTransfers && transfers.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title={cfg.transfersTitle} />
            <Card>
              {transfers.map((t, i) => (
                <View key={t.id}>
                  {i > 0 ? <View style={styles.rowDivider} /> : null}
                  <TransferRow item={t} />
                </View>
              ))}
            </Card>
          </View>
        ) : null}

        {/* NÄCHSTE SPIELE – echt wo möglich */}
        {(fixtures.length > 0 || demoEvents.length > 0) && (
          <View style={styles.section}>
            <SectionHeader title={cfg.eventsTitle} />
            <Card>
              {fixtures.length > 0
                ? fixtures.slice(0, 6).map((m, i) => (
                    <View key={m.id}>
                      {i > 0 ? <View style={styles.rowDivider} /> : null}
                      <LiveFixtureRow item={m} />
                    </View>
                  ))
                : demoEvents.map((e, i) => (
                    <View key={e.id}>
                      {i > 0 ? <View style={styles.rowDivider} /> : null}
                      <EventRow item={e} />
                    </View>
                  ))}
            </Card>
          </View>
        )}

        {/* TRENDING */}
        <View style={styles.section}>
          <SectionHeader title="WAS GERADE TRENDING IST" actionLabel={null} />
          <Card>
            {trending.map((t, i) => (
              <View key={t.rank}>
                {i > 0 ? <View style={styles.rowDivider} /> : null}
                <TrendingRow item={t} />
              </View>
            ))}
          </Card>
        </View>

        <Text style={styles.footerNote}>
          {liveData.live
            ? 'Live-Daten & Logos: TheSportsDB · News als KI-Zusammenfassung'
            : 'Prototyp · Beispiel-Daten (für diese Sportart noch keine Live-Quelle)'}
        </Text>
      </ScrollView>
      </Frame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  ambient: { position: 'absolute', top: 0, left: 0, right: 0, height: 420 },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  logo: { color: C.text, fontSize: F.h3, fontWeight: '900', letterSpacing: 0.5, fontStyle: 'italic' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  bellWrap: { position: 'relative' },
  headerIcon: { fontSize: 20 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: C.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  profileChip: {
    backgroundColor: C.surfaceElevated,
    borderRadius: R.pill,
    paddingHorizontal: S.md,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  profileText: { color: C.text, fontSize: F.small, fontWeight: '700' },
  scroll: { padding: S.lg, gap: S.lg, paddingBottom: S.xxl },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.sm,
    backgroundColor: C.surfaceAlt,
    borderRadius: R.pill,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
  },
  searchIcon: { fontSize: 15 },
  searchPlaceholder: { color: C.textFaint, fontSize: F.body },
  shopLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: S.md,
    backgroundColor: C.surfaceAlt,
    borderRadius: R.lg,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: S.lg,
    paddingVertical: S.md,
  },
  shopIcon: { fontSize: 22 },
  shopTitle: { color: C.text, fontSize: F.body, fontWeight: '800' },
  shopSub: { color: C.textFaint, fontSize: F.small, marginTop: 1 },
  shopChevron: { color: C.textDim, fontSize: 22, fontWeight: '800' },
  tickerBox: { borderRadius: R.md, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  section: { gap: 0 },
  sectionTitle: { color: C.text, fontSize: F.h3, fontWeight: '800', letterSpacing: 0.2 },
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: S.md,
  },
  actionMuted: { color: C.accent, fontSize: F.small, fontWeight: '700' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: S.md },
  rowDivider: { height: 1, backgroundColor: C.borderSoft },
  tableCaption: { color: C.textDim, fontSize: F.small, fontWeight: '700', marginBottom: S.sm },
  footerNote: { color: C.textFaint, fontSize: F.tiny, textAlign: 'center', marginTop: S.sm },
});
