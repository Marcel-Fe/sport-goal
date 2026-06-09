/**
 * Zentrale Mock-Daten für den Prototyp (keine echten/lizenzierten Inhalte).
 * Sport-/vereinsadaptiv: Tabellen pro Liga, Hero-Kacheln pro Team, generische
 * Events (Spiele/Rennen/Turniere) und eine Sport-Konfiguration für die Sektionen.
 * Später wird dieses Modul durch echte API-Aufrufe ersetzt – das UI bleibt gleich.
 */
import { getTeam, type Sport } from './teams';

export type TransferStatus = 'confirmed' | 'negotiation' | 'rumour';
export type LiveStatus = 'live' | 'upcoming' | 'finished';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  teamId: string;
  sport: Sport;
  badge?: string;
  hasVideo?: boolean;
  aiShort: string;
  aiLong: string;
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  timeAgo: string;
  source: string;
  teamId: string;
  sport: Sport;
}

export interface ShortClip {
  id: string;
  title: string;
  duration: string;
  teamId: string;
  sport: Sport;
  views: string;
}

export interface Transfer {
  id: string;
  player: string;
  fromTeamId: string;
  toTeamId: string;
  status: TransferStatus;
  probability: number;
  sport: Sport;
}

export interface StandingRow {
  pos: number;
  teamId: string;
  played: number;
  points: number;
}

export interface LiveEvent {
  id: string;
  competition: string;
  sport: Sport;
  homeId: string;
  awayId: string;
  homeScore: string;
  awayScore: string;
  clock: string;
  status: LiveStatus;
}

export interface TrendingTopic {
  rank: number;
  tag: string;
  posts: string;
  trend: 'up' | 'down';
  sport?: Sport;
}

/** Generisches kommendes Event: Fußball/NBA = Duell, F1/Tennis = Einzel-Event. */
export interface UpcomingEvent {
  id: string;
  dateLabel: string;
  timeLabel: string;
  sport: Sport;
  teamId: string;
  opponentId?: string;
  title?: string;
  sub: string;
}

export interface HeroTile {
  icon?: string;
  iconTeamId?: string;
  label: string;
  value: string;
  sub?: string;
  danger?: boolean;
}

export const STATUS_LABEL: Record<TransferStatus, string> = {
  confirmed: 'Bestätigt',
  negotiation: 'Verhandlung',
  rumour: 'Gerücht',
};

/** Pro Sportart: Sektions-Titel, Tabellen-Spalten, ob Transfers sinnvoll sind. */
export const SPORT_CONFIG: Record<
  Sport,
  {
    standingsTitle: string;
    col1: string;
    col2: string;
    showTransfers: boolean;
    transfersTitle: string;
    eventsTitle: string;
  }
> = {
  football: { standingsTitle: 'AKTUELLE TABELLE', col1: 'SP', col2: 'PKT', showTransfers: true, transfersTitle: 'TRANSFER-RADAR', eventsTitle: 'NÄCHSTE SPIELE' },
  f1: { standingsTitle: 'FAHRERWERTUNG', col1: 'R', col2: 'PKT', showTransfers: false, transfersTitle: 'FAHRERMARKT', eventsTitle: 'RENNKALENDER' },
  tennis: { standingsTitle: 'WELTRANGLISTE', col1: 'T', col2: 'PKT', showTransfers: false, transfersTitle: '', eventsTitle: 'NÄCHSTE TURNIERE' },
  nba: { standingsTitle: 'CONFERENCE', col1: 'SP', col2: 'S', showTransfers: true, transfersTitle: 'TRADE-RADAR', eventsTitle: 'NÄCHSTE SPIELE' },
  nfl: { standingsTitle: 'DIVISION', col1: 'SP', col2: 'S', showTransfers: true, transfersTitle: 'TRADE-RADAR', eventsTitle: 'NÄCHSTE SPIELE' },
  handball: { standingsTitle: 'TABELLE', col1: 'SP', col2: 'PKT', showTransfers: true, transfersTitle: 'TRANSFER-RADAR', eventsTitle: 'NÄCHSTE SPIELE' },
  hockey: { standingsTitle: 'TABELLE', col1: 'SP', col2: 'PKT', showTransfers: true, transfersTitle: 'TRANSFER-RADAR', eventsTitle: 'NÄCHSTE SPIELE' },
};

// ---------------------------------------------------------------- NEWS
export const NEWS: NewsItem[] = [
  { id: 'n1', title: 'Harry Kane verlängert bis 2027 beim FC Bayern!', summary: 'Der Torjäger bleibt den Bayern erhalten. "Ich fühle mich hier sehr wohl und wir haben noch viel vor."', source: 'Vereinsmeldung', timeAgo: 'vor 30 Min.', teamId: 'bayern', sport: 'football', badge: 'OFFIZIELL', aiShort: 'Kane bleibt bis 2027 in München. Klares Bekenntnis zum Titelprojekt, Vertrag vorzeitig verlängert.', aiLong: 'Harry Kane hat seinen Vertrag beim FC Bayern vorzeitig bis 2027 verlängert. Der englische Nationalspieler betont seine Zufriedenheit und die sportlichen Ziele des Vereins. Die Verlängerung gilt als Signal an die Konkurrenz und stärkt die Planungssicherheit im Sturm.' },
  { id: 'n2', title: 'Pressekonferenz vor dem Spiel gegen Frankfurt', summary: 'Der Trainer spricht über Aufstellung, Personal und die Ziele für die restliche Saison.', source: 'Medienrunde', timeAgo: 'vor 1 Std.', teamId: 'bayern', sport: 'football', hasVideo: true, aiShort: 'Personal-Updates vor Frankfurt, klarer Titelanspruch.', aiLong: 'In der Pressekonferenz vor dem Heimspiel gegen Eintracht Frankfurt ging es um die voraussichtliche Aufstellung, den Fitnessstand mehrerer Spieler und die taktische Ausrichtung gegen einen formstarken Gegner.' },
  { id: 'n3', title: 'Musiala wieder im Teamtraining – Comeback naht', summary: 'Nach seiner Pause stand der Offensivspieler erstmals wieder mit der Mannschaft auf dem Platz.', source: 'Trainingsbericht', timeAgo: 'vor 2 Std.', teamId: 'bayern', sport: 'football', hasVideo: true, aiShort: 'Musiala zurück im Mannschaftstraining – Rückkehr rückt näher.', aiLong: 'Jamal Musiala hat das volle Mannschaftstraining wieder aufgenommen. Damit steigt die Wahrscheinlichkeit, dass er im nächsten Spiel im Kader steht. Der Trainerstab entscheidet kurzfristig über die Einsatzzeit.' },
  { id: 'n7', title: 'BVB dreht Spiel in der Schlussphase', summary: 'Zwei späte Tore bringen Dortmund einen wichtigen Heimsieg.', source: 'Spielbericht', timeAgo: 'vor 6 Std.', teamId: 'dortmund', sport: 'football', aiShort: 'Dortmund gewinnt dank später Tore.', aiLong: 'Borussia Dortmund hat ein zähes Heimspiel in der Schlussphase gedreht. Zwei Treffer in den letzten zehn Minuten sicherten drei wichtige Punkte im Kampf um die Champions-League-Plätze.' },
  { id: 'n8', title: 'Salah trifft erneut – Liverpool bleibt vorne', summary: 'Der Ägypter erzielt sein 21. Saisontor und führt sein Team an die Tabellenspitze.', source: 'Spielbericht', timeAgo: 'vor 3 Std.', teamId: 'liverpool', sport: 'football', aiShort: 'Salah-Tor hält Liverpool an der Spitze der Premier League.', aiLong: 'Mohamed Salah hat mit seinem 21. Saisontreffer den Heimsieg von Liverpool gesichert. Das Team baut damit die Tabellenführung in der Premier League aus und untermauert seine Titelambitionen.' },
  { id: 'n9', title: 'Bellingham führt Real ins Topspiel', summary: 'Der Mittelfeldspieler glänzt mit Tor und Vorlage im Clásico.', source: 'Spielbericht', timeAgo: 'vor 4 Std.', teamId: 'realmadrid', sport: 'football', aiShort: 'Bellingham mit Tor und Vorlage im Clásico-Sieg.', aiLong: 'Jude Bellingham war beim Sieg von Real Madrid der überragende Mann auf dem Platz. Mit einem Tor und einer Vorlage entschied er das Spitzenspiel und festigte Reals Position an der Tabellenspitze der La Liga.' },
  { id: 'n4', title: 'Verstappen dominiert Qualifying – Pole in Monaco', summary: 'Mit der schnellsten Runde sichert sich der Weltmeister den Startplatz ganz vorne.', source: 'Rennbericht', timeAgo: 'vor 3 Std.', teamId: 'verstappen', sport: 'f1', aiShort: 'Verstappen holt die Pole in Monaco und geht als Favorit ins Rennen.', aiLong: 'Max Verstappen war im Qualifying von Monaco eine Klasse für sich und sicherte sich die Pole-Position. Auf dem engen Stadtkurs gilt die Startposition als besonders wertvoll.' },
  { id: 'n10', title: 'Hamilton: "Das Auto wird besser"', summary: 'Der Rekordweltmeister sieht Fortschritte und blickt optimistisch auf die nächsten Rennen.', source: 'Interview', timeAgo: 'vor 7 Std.', teamId: 'hamilton', sport: 'f1', hasVideo: true, aiShort: 'Hamilton sieht Aufwärtstrend beim Auto.', aiLong: 'Lewis Hamilton zeigt sich nach den jüngsten Updates optimistisch. Das Team habe die Richtung gefunden und er erwarte in den kommenden Rennen einen Schritt nach vorne in Sachen Pace und Konstanz.' },
  { id: 'n5', title: 'Djokovic erreicht Halbfinale in Rom', summary: 'Souveräner Sieg in zwei Sätzen – der Serbe bleibt im Turnier auf Kurs.', source: 'Turnierbericht', timeAgo: 'vor 4 Std.', teamId: 'djokovic', sport: 'tennis', aiShort: 'Djokovic steht im Halbfinale von Rom, Sieg in zwei Sätzen.', aiLong: 'Novak Djokovic zog mit einem überzeugenden Zwei-Satz-Erfolg ins Halbfinale ein. Seine Form vor den anstehenden Grand-Slam-Wochen stimmt das Lager optimistisch.' },
  { id: 'n6', title: 'Lakers feiern Heimsieg gegen Boston', summary: 'Ein starkes viertes Viertel bringt die Entscheidung im Topspiel.', source: 'Spielbericht', timeAgo: 'vor 5 Std.', teamId: 'lakers', sport: 'nba', aiShort: 'Lakers gewinnen das Topspiel gegen die Celtics dank starkem Schlussviertel.', aiLong: 'Die Los Angeles Lakers entschieden ein umkämpftes Topspiel gegen die Boston Celtics für sich. Ein dominantes letztes Viertel gab den Ausschlag und festigt die Position in der Tabelle.' },
  { id: 'n11', title: 'Mahomes führt Chiefs zum Sieg in der Schlussminute', summary: 'Ein präziser Drive in den letzten 90 Sekunden entscheidet das Spiel.', source: 'Spielbericht', timeAgo: 'vor 8 Std.', teamId: 'chiefs', sport: 'nfl', badge: 'GAME-WINNER', aiShort: 'Mahomes mit Last-Minute-Drive – Chiefs gewinnen knapp.', aiLong: 'Patrick Mahomes hat die Kansas City Chiefs mit einem starken Drive in der Schlussminute zum Sieg geführt. Der Quarterback bewies erneut Nervenstärke und brachte sein Team in eine gute Ausgangslage für die Playoffs.' },
  { id: 'n12', title: 'Josh Allen mit vier Touchdown-Pässen', summary: 'Die Bills überrollen ihren Division-Rivalen in einer starken zweiten Halbzeit.', source: 'Spielbericht', timeAgo: 'vor 10 Std.', teamId: 'bills', sport: 'nfl', aiShort: 'Allen wirft vier Touchdowns – klarer Bills-Sieg.', aiLong: 'Josh Allen hat mit vier Touchdown-Pässen eine Galavorstellung abgeliefert. Die Buffalo Bills setzten sich in der Division deutlich durch und untermauerten ihre Ambitionen in der AFC.' },
];

// ---------------------------------------------------------------- VIDEOS
export const VIDEOS: VideoItem[] = [
  { id: 'v1', title: 'Pressekonferenz: Trainer spricht über das Topspiel', duration: '12:45', timeAgo: 'vor 1 Std.', source: 'Vereins-TV', teamId: 'bayern', sport: 'football' },
  { id: 'v2', title: 'Kane: "Wir glauben an das Triple!"', duration: '05:30', timeAgo: 'vor 2 Std.', source: 'Vereins-TV', teamId: 'bayern', sport: 'football' },
  { id: 'v3', title: 'Highlights: Bayern 3:1 Stuttgart', duration: '03:15', timeAgo: 'vor 1 Tag', source: 'Liga', teamId: 'bayern', sport: 'football' },
  { id: 'v4', title: 'Training: Musiala ist zurück!', duration: '04:10', timeAgo: 'vor 3 Std.', source: 'Vereins-TV', teamId: 'bayern', sport: 'football' },
  { id: 'v5', title: 'Highlights: Liverpool 2:1 Aston Villa', duration: '03:40', timeAgo: 'vor 3 Std.', source: 'Liga', teamId: 'liverpool', sport: 'football' },
  { id: 'v6', title: 'Onboard: Verstappens Pole-Runde in Monaco', duration: '01:55', timeAgo: 'vor 3 Std.', source: 'Motorsport', teamId: 'verstappen', sport: 'f1' },
  { id: 'v7', title: 'Press: Hamilton über die Updates', duration: '06:20', timeAgo: 'vor 7 Std.', source: 'Team-TV', teamId: 'hamilton', sport: 'f1' },
  { id: 'v8', title: 'Top 10 Plays: Lakers vs Celtics', duration: '04:05', timeAgo: 'vor 5 Std.', source: 'Liga', teamId: 'lakers', sport: 'nba' },
  { id: 'v9', title: 'Djokovic: Die besten Ballwechsel aus Rom', duration: '02:30', timeAgo: 'vor 4 Std.', source: 'Turnier', teamId: 'djokovic', sport: 'tennis' },
  { id: 'v10', title: 'Mahomes Magic: Der Game-Winning Drive', duration: '03:50', timeAgo: 'vor 8 Std.', source: 'Liga', teamId: 'chiefs', sport: 'nfl' },
  { id: 'v11', title: 'Josh Allen: Alle 4 Touchdown-Pässe', duration: '02:45', timeAgo: 'vor 10 Std.', source: 'Liga', teamId: 'bills', sport: 'nfl' },
];

// ---------------------------------------------------------------- SHORTS
export const SHORTS: ShortClip[] = [
  { id: 's1', title: 'Kanes Traumtor', duration: '0:18', teamId: 'bayern', sport: 'football', views: '1,2 Mio' },
  { id: 's5', title: 'Salah Solo-Lauf', duration: '0:22', teamId: 'liverpool', sport: 'football', views: '730K' },
  { id: 's7', title: 'Bellingham-Volley', duration: '0:16', teamId: 'realmadrid', sport: 'football', views: '980K' },
  { id: 's2', title: 'Verstappen Onboard-Runde', duration: '0:42', teamId: 'verstappen', sport: 'f1', views: '860K' },
  { id: 's6', title: 'Boxenstopp 1,9s', duration: '0:12', teamId: 'norris', sport: 'f1', views: '410K' },
  { id: 's4', title: 'LeBron Block des Tages', duration: '0:15', teamId: 'lakers', sport: 'nba', views: '2,1 Mio' },
  { id: 's3', title: 'Djokovic Winner-Stop', duration: '0:25', teamId: 'djokovic', sport: 'tennis', views: '540K' },
  { id: 's8', title: 'Mahomes No-Look-Pass', duration: '0:14', teamId: 'chiefs', sport: 'nfl', views: '1,5 Mio' },
  { id: 's9', title: 'Allen Hurdle über den Defender', duration: '0:11', teamId: 'bills', sport: 'nfl', views: '690K' },
];

// ---------------------------------------------------------------- TRANSFERS (Fußball)
export const TRANSFERS: Transfer[] = [
  { id: 't1', player: 'Victor Osimhen', fromTeamId: 'realmadrid', toTeamId: 'bayern', status: 'rumour', probability: 70, sport: 'football' },
  { id: 't2', player: 'Jonathan Tah', fromTeamId: 'leverkusen', toTeamId: 'bayern', status: 'negotiation', probability: 60, sport: 'football' },
  { id: 't3', player: 'Joshua Kimmich', fromTeamId: 'bayern', toTeamId: 'bayern', status: 'confirmed', probability: 90, sport: 'football' },
  { id: 't5', player: 'Florian Wirtz', fromTeamId: 'leverkusen', toTeamId: 'liverpool', status: 'negotiation', probability: 65, sport: 'football' },
  { id: 't6', player: 'Alphonso Davies', fromTeamId: 'bayern', toTeamId: 'realmadrid', status: 'rumour', probability: 50, sport: 'football' },
  { id: 't7', player: 'Nico Williams', fromTeamId: 'atletico', toTeamId: 'barcelona', status: 'negotiation', probability: 62, sport: 'football' },
];

// ---------------------------------------------------------------- STANDINGS pro Liga
export const STANDINGS_BY_LEAGUE: Record<string, StandingRow[]> = {
  Bundesliga: [
    { pos: 1, teamId: 'bayern', played: 32, points: 72 },
    { pos: 2, teamId: 'leverkusen', played: 32, points: 67 },
    { pos: 3, teamId: 'stuttgart', played: 32, points: 60 },
    { pos: 4, teamId: 'leipzig', played: 32, points: 56 },
    { pos: 5, teamId: 'dortmund', played: 32, points: 53 },
  ],
  'Premier League': [
    { pos: 1, teamId: 'liverpool', played: 36, points: 84 },
    { pos: 2, teamId: 'mancity', played: 36, points: 82 },
    { pos: 3, teamId: 'arsenal', played: 36, points: 77 },
    { pos: 4, teamId: 'astonvilla', played: 36, points: 66 },
  ],
  'La Liga': [
    { pos: 1, teamId: 'realmadrid', played: 35, points: 88 },
    { pos: 2, teamId: 'barcelona', played: 35, points: 82 },
    { pos: 3, teamId: 'atletico', played: 35, points: 73 },
  ],
  'Formel 1': [
    { pos: 1, teamId: 'verstappen', played: 8, points: 169 },
    { pos: 2, teamId: 'norris', played: 8, points: 144 },
    { pos: 3, teamId: 'leclerc', played: 8, points: 138 },
    { pos: 4, teamId: 'piastri', played: 8, points: 124 },
    { pos: 5, teamId: 'russell', played: 8, points: 98 },
    { pos: 6, teamId: 'hamilton', played: 8, points: 85 },
  ],
  NBA: [
    { pos: 1, teamId: 'celtics', played: 78, points: 60 },
    { pos: 2, teamId: 'nuggets', played: 78, points: 55 },
    { pos: 3, teamId: 'lakers', played: 78, points: 48 },
    { pos: 4, teamId: 'warriors', played: 78, points: 46 },
  ],
  ATP: [
    { pos: 1, teamId: 'sinner', played: 18, points: 9890 },
    { pos: 2, teamId: 'alcaraz', played: 18, points: 8620 },
    { pos: 3, teamId: 'djokovic', played: 16, points: 8460 },
    { pos: 4, teamId: 'medvedev', played: 19, points: 7165 },
  ],
  NFL: [
    { pos: 1, teamId: 'chiefs', played: 16, points: 13 },
    { pos: 2, teamId: 'bills', played: 16, points: 12 },
    { pos: 3, teamId: 'eagles', played: 16, points: 11 },
    { pos: 4, teamId: 'niners', played: 16, points: 10 },
    { pos: 5, teamId: 'ravens', played: 16, points: 10 },
    { pos: 6, teamId: 'cowboys', played: 16, points: 8 },
  ],
};

/** Rückwärtskompatibel (z. B. Team-Profil): Standard = Bundesliga. */
export const STANDINGS: StandingRow[] = STANDINGS_BY_LEAGUE.Bundesliga;

export function standingsForLeague(league?: string): StandingRow[] {
  return (league && STANDINGS_BY_LEAGUE[league]) || STANDINGS_BY_LEAGUE.Bundesliga;
}

// ---------------------------------------------------------------- LIVE (multisport)
export const LIVE_EVENTS: LiveEvent[] = [
  { id: 'l1', competition: 'Bundesliga', sport: 'football', homeId: 'dortmund', awayId: 'wolfsburg', homeScore: '2', awayScore: '2', clock: "68'", status: 'live' },
  { id: 'l2', competition: 'Premier League', sport: 'football', homeId: 'liverpool', awayId: 'astonvilla', homeScore: '1', awayScore: '1', clock: "75'", status: 'live' },
  { id: 'l6', competition: 'La Liga', sport: 'football', homeId: 'realmadrid', awayId: 'barcelona', homeScore: '2', awayScore: '1', clock: "59'", status: 'live' },
  { id: 'l3', competition: 'Formel 1 – Qualifying', sport: 'f1', homeId: 'verstappen', awayId: 'norris', homeScore: '1:12.245', awayScore: '+0.356', clock: 'Q3', status: 'live' },
  { id: 'l4', competition: 'NBA', sport: 'nba', homeId: 'lakers', awayId: 'celtics', homeScore: '88', awayScore: '85', clock: 'Q4 4:12', status: 'live' },
  { id: 'l5', competition: 'ATP Rom – Halbfinale', sport: 'tennis', homeId: 'djokovic', awayId: 'alcaraz', homeScore: '6:4 3:2', awayScore: '', clock: 'Satz 2', status: 'live' },
  { id: 'l7', competition: 'NFL', sport: 'nfl', homeId: 'chiefs', awayId: 'bills', homeScore: '21', awayScore: '17', clock: 'Q3 5:42', status: 'live' },
];

// ---------------------------------------------------------------- TRENDING
export const TRENDING: TrendingTopic[] = [
  { rank: 1, tag: '#Kane2027', posts: '24,3K Beiträge', trend: 'up', sport: 'football' },
  { rank: 2, tag: '#BayernFrankfurt', posts: '12,1K Beiträge', trend: 'up', sport: 'football' },
  { rank: 3, tag: '#MonacoGP', posts: '9,4K Beiträge', trend: 'up', sport: 'f1' },
  { rank: 4, tag: '#Clasico', posts: '8,7K Beiträge', trend: 'up', sport: 'football' },
  { rank: 5, tag: '#LakeShow', posts: '6,2K Beiträge', trend: 'down', sport: 'nba' },
  { rank: 6, tag: '#Djokovic', posts: '5,9K Beiträge', trend: 'up', sport: 'tennis' },
  { rank: 7, tag: '#ChiefsKingdom', posts: '14,8K Beiträge', trend: 'up', sport: 'nfl' },
];

// ---------------------------------------------------------------- EVENTS (generisch)
export const EVENTS: UpcomingEvent[] = [
  // Fußball – Duelle
  { id: 'e1', dateLabel: '24.05.', timeLabel: '15:30', sport: 'football', teamId: 'bayern', opponentId: 'frankfurt', sub: 'Bundesliga' },
  { id: 'e2', dateLabel: '01.06.', timeLabel: '18:00', sport: 'football', teamId: 'bayern', opponentId: 'wolfsburg', sub: 'Bundesliga' },
  { id: 'e3', dateLabel: '15.06.', timeLabel: '21:00', sport: 'football', teamId: 'bayern', opponentId: 'realmadrid', sub: 'Testspiel' },
  { id: 'e4', dateLabel: '25.05.', timeLabel: '17:30', sport: 'football', teamId: 'dortmund', opponentId: 'leipzig', sub: 'Bundesliga' },
  { id: 'e5', dateLabel: '26.05.', timeLabel: '16:00', sport: 'football', teamId: 'liverpool', opponentId: 'mancity', sub: 'Premier League' },
  { id: 'e6', dateLabel: '27.05.', timeLabel: '21:00', sport: 'football', teamId: 'realmadrid', opponentId: 'atletico', sub: 'La Liga' },
  // F1 – Rennen
  { id: 'e7', dateLabel: '26.05.', timeLabel: '15:00', sport: 'f1', teamId: 'verstappen', title: 'Großer Preis von Monaco', sub: 'Monte Carlo · Rennen' },
  { id: 'e8', dateLabel: '09.06.', timeLabel: '20:00', sport: 'f1', teamId: 'verstappen', title: 'Großer Preis von Kanada', sub: 'Montréal · Rennen' },
  { id: 'e9', dateLabel: '26.05.', timeLabel: '15:00', sport: 'f1', teamId: 'hamilton', title: 'Großer Preis von Monaco', sub: 'Monte Carlo · Rennen' },
  // NBA – Duelle
  { id: 'e10', dateLabel: '24.05.', timeLabel: '03:00', sport: 'nba', teamId: 'lakers', opponentId: 'warriors', sub: 'NBA · Playoffs' },
  { id: 'e11', dateLabel: '27.05.', timeLabel: '02:30', sport: 'nba', teamId: 'lakers', opponentId: 'nuggets', sub: 'NBA · Playoffs' },
  // Tennis – Turniere
  { id: 'e12', dateLabel: '25.05.', timeLabel: '14:00', sport: 'tennis', teamId: 'djokovic', title: 'Roland Garros', sub: 'Paris · 1. Runde' },
  { id: 'e13', dateLabel: '01.06.', timeLabel: '13:00', sport: 'tennis', teamId: 'djokovic', title: 'Roland Garros', sub: 'Paris · Achtelfinale' },
  // NFL – Duelle
  { id: 'e14', dateLabel: '08.09.', timeLabel: '19:00', sport: 'nfl', teamId: 'chiefs', opponentId: 'ravens', sub: 'NFL · Week 1' },
  { id: 'e15', dateLabel: '15.09.', timeLabel: '22:25', sport: 'nfl', teamId: 'chiefs', opponentId: 'eagles', sub: 'NFL · Week 2' },
  { id: 'e16', dateLabel: '08.09.', timeLabel: '19:00', sport: 'nfl', teamId: 'bills', opponentId: 'cowboys', sub: 'NFL · Week 1' },
];

/** Rückwärtskompatibel: alte MATCHES-API (nur Fußball-Duelle). */
export interface Match {
  id: string;
  dateLabel: string;
  timeLabel: string;
  homeId: string;
  awayId: string;
  competition: string;
}
export const MATCHES: Match[] = EVENTS.filter((e) => e.opponentId).map((e) => ({
  id: e.id,
  dateLabel: e.dateLabel,
  timeLabel: e.timeLabel,
  homeId: e.teamId,
  awayId: e.opponentId!,
  competition: e.sub,
}));

// ---------------------------------------------------------------- HERO-META pro Team
// Die "Nächstes"-Kachel wird dynamisch aus EVENTS berechnet; hier die 3 weiteren.
export const TEAM_META: Record<string, { tiles: HeroTile[] }> = {
  bayern: { tiles: [
    { icon: '⚽', label: 'LETZTES', value: '3:1 VfB', sub: 'Bundesliga' },
    { icon: '👤', label: 'TOP-TORJÄGER', value: 'H. Kane', sub: '24 Tore' },
    { icon: '✚', label: 'VERLETZT', value: '2 Spieler', sub: 'aktuell', danger: true },
  ] },
  dortmund: { tiles: [
    { icon: '⚽', label: 'LETZTES', value: '2:0 FCA', sub: 'Bundesliga' },
    { icon: '👤', label: 'TOP-TORJÄGER', value: 'Guirassy', sub: '18 Tore' },
    { icon: '✚', label: 'VERLETZT', value: '1 Spieler', sub: 'aktuell', danger: true },
  ] },
  liverpool: { tiles: [
    { icon: '⚽', label: 'LETZTES', value: '2:1 AVL', sub: 'Premier League' },
    { icon: '👤', label: 'TOP-TORJÄGER', value: 'M. Salah', sub: '21 Tore' },
    { icon: '🔥', label: 'FORM', value: '3 Siege', sub: 'in Serie' },
  ] },
  realmadrid: { tiles: [
    { icon: '⚽', label: 'LETZTES', value: '3:1 BAR', sub: 'La Liga' },
    { icon: '👤', label: 'TOP-SCORER', value: 'Bellingham', sub: '19 Tore' },
    { icon: '🏆', label: 'PLATZ', value: '1.', sub: 'La Liga' },
  ] },
  leverkusen: { tiles: [
    { icon: '⚽', label: 'LETZTES', value: '1:1 RBL', sub: 'Bundesliga' },
    { icon: '👤', label: 'TOP-TORJÄGER', value: 'Boniface', sub: '14 Tore' },
    { icon: '🔥', label: 'FORM', value: 'stark', sub: 'ungeschlagen' },
  ] },
  verstappen: { tiles: [
    { icon: '🏁', label: 'LETZTES', value: 'P1 Monaco', sub: 'Qualifying' },
    { icon: '🏆', label: 'WM-STAND', value: '169 Pkt', sub: 'Führung' },
    { icon: '🏎️', label: 'TEAM', value: 'Red Bull', sub: 'Startplatz 1' },
  ] },
  hamilton: { tiles: [
    { icon: '🏁', label: 'LETZTES', value: 'P4 Monaco', sub: 'Qualifying' },
    { icon: '🏆', label: 'WM-STAND', value: '85 Pkt', sub: 'Rang 6' },
    { icon: '🏎️', label: 'TEAM', value: 'Ferrari', sub: 'im Aufwind' },
  ] },
  mercedes: { tiles: [
    { icon: '🏁', label: 'LETZTES', value: 'P3 Monaco', sub: 'Konstrukteur' },
    { icon: '🏆', label: 'WM-STAND', value: '183 Pkt', sub: 'Rang 3' },
    { icon: '🏎️', label: 'FAHRER', value: 'Russell', sub: 'Rang 5' },
  ] },
  lakers: { tiles: [
    { icon: '🏀', label: 'LETZTES', value: '112:108 BOS', sub: 'NBA' },
    { icon: '👤', label: 'TOP-SCORER', value: 'L. James', sub: '28,4 PPG' },
    { icon: '🏆', label: 'PLATZ', value: '3.', sub: 'West' },
  ] },
  djokovic: { tiles: [
    { icon: '🎾', label: 'LETZTES', value: '2:0 Sätze', sub: 'Rom HF' },
    { icon: '🏆', label: 'RANGLISTE', value: 'Nr. 3', sub: 'ATP' },
    { icon: '🔥', label: 'STATUS', value: 'Halbfinale', sub: 'Rom' },
  ] },
  chiefs: { tiles: [
    { icon: '🏈', label: 'LETZTES', value: '27:20 BAL', sub: 'NFL' },
    { icon: '👤', label: 'TOP-QB', value: 'Mahomes', sub: '28 TD' },
    { icon: '🏆', label: 'BILANZ', value: '13-3', sub: 'AFC West' },
  ] },
  bills: { tiles: [
    { icon: '🏈', label: 'LETZTES', value: '34:14 DAL', sub: 'NFL' },
    { icon: '👤', label: 'TOP-QB', value: 'J. Allen', sub: '32 TD' },
    { icon: '🏆', label: 'BILANZ', value: '12-4', sub: 'AFC East' },
  ] },
  eagles: { tiles: [
    { icon: '🏈', label: 'LETZTES', value: '24:21 SF', sub: 'NFL' },
    { icon: '👤', label: 'TOP-RB', value: 'Barkley', sub: '1.450 Yds' },
    { icon: '🏆', label: 'BILANZ', value: '11-5', sub: 'NFC East' },
  ] },
};

// ---------------------------------------------------------------- Helfer
export function newsForTeam(teamId: string): NewsItem[] {
  return NEWS.filter((n) => n.teamId === teamId);
}
export function getNews(id: string): NewsItem | undefined {
  return NEWS.find((n) => n.id === id);
}

/** Liegt ein "DD.MM."-Label heute oder in der Zukunft? (verhindert veraltete Termine) */
function isUpcomingLabel(dateLabel: string): boolean {
  const m = dateLabel.match(/^(\d{1,2})\.(\d{1,2})\./);
  if (!m) return true; // unbekanntes Format → nicht ausblenden
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ev = new Date(now.getFullYear(), Number(m[2]) - 1, Number(m[1]));
  return ev.getTime() >= today.getTime();
}

/** Hero-Kacheln für ein Team: Nächstes Event (berechnet) + 3 aus TEAM_META. */
export function heroTilesFor(teamId: string): HeroTile[] {
  // Nur echte, noch nicht gespielte Termine — keine veralteten Demo-Daten zeigen.
  const next = EVENTS.find((e) => e.teamId === teamId && isUpcomingLabel(e.dateLabel));
  const team = getTeam(teamId);
  const opp = next?.opponentId ? getTeam(next.opponentId) : undefined;
  const nextTile: HeroTile = next
    ? {
        iconTeamId: opp?.id,
        icon: opp ? undefined : team?.sport === 'f1' ? '🏁' : '🎾',
        label: 'NÄCHSTES',
        value: opp ? `vs ${opp.initials}` : (next.title?.split(' ').slice(-1)[0] ?? 'Event'),
        sub: `${next.dateLabel} · ${next.timeLabel}`,
      }
    : { icon: '📅', label: 'NÄCHSTES', value: '—', sub: 'kein Termin' };

  const meta = TEAM_META[teamId]?.tiles ?? [
    { icon: '⭐', label: 'SAISON', value: 'läuft', sub: team?.league ?? '' },
    { icon: '📊', label: 'STATUS', value: 'aktiv', sub: '' },
    { icon: '❤️', label: 'FANS', value: 'dabei', sub: '' },
  ];
  return [nextTile, ...meta];
}

/**
 * Sortiert/filtert einen Feed nach Favoriten:
 * 1) exakte Team-Treffer, 2) gleiche Sportart, 3) Rest. Nie leer.
 */
export function byFavorites<T extends { sport: Sport; teamId?: string }>(
  items: T[],
  favSports: Sport[],
  favTeamIds: string[],
): T[] {
  if (favSports.length === 0 && favTeamIds.length === 0) return items;
  const score = (it: T) =>
    (it.teamId && favTeamIds.includes(it.teamId) ? 2 : 0) +
    (favSports.includes(it.sport) ? 1 : 0);
  const ranked = items.filter((it) => score(it) > 0).sort((a, b) => score(b) - score(a));
  return ranked.length > 0 ? ranked : items;
}
