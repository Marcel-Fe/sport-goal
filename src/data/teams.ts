/**
 * Vereine, Teams und Athleten als "Entitäten".
 * Statt geschützter Logos: Initialen + Vereinsfarben (siehe components/TeamCrest).
 * Rechtlich sauber – später ersetzbar durch lizenzierte Logos einer Daten-API.
 */

export type Sport =
  | 'football'
  | 'f1'
  | 'tennis'
  | 'nba'
  | 'nfl'
  | 'handball'
  | 'hockey';

export const SPORTS: { id: Sport; label: string; icon: string }[] = [
  { id: 'football', label: 'Fußball', icon: '⚽' },
  { id: 'f1', label: 'Formel 1', icon: '🏎️' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'nba', label: 'Basketball', icon: '🏀' },
  { id: 'nfl', label: 'NFL', icon: '🏈' },
  { id: 'handball', label: 'Handball', icon: '🤾' },
  { id: 'hockey', label: 'Eishockey', icon: '🏒' },
];

export interface Team {
  id: string;
  name: string;
  initials: string;
  colors: [string, string]; // [Fläche, Text/Akzent]
  sport: Sport;
  league?: string;
  motto?: string;
  city?: string;
  isAthlete?: boolean;
}

export const TEAMS: Record<string, Team> = {
  // ---------------- Fußball: Bundesliga
  bayern: { id: 'bayern', name: 'FC Bayern München', initials: 'FCB', colors: ['#DC052D', '#FFFFFF'], sport: 'football', league: 'Bundesliga', motto: 'Mia san mia', city: 'München' },
  dortmund: { id: 'dortmund', name: 'Borussia Dortmund', initials: 'BVB', colors: ['#FDE100', '#000000'], sport: 'football', league: 'Bundesliga', motto: 'Echte Liebe', city: 'Dortmund' },
  leverkusen: { id: 'leverkusen', name: 'Bayer Leverkusen', initials: 'B04', colors: ['#E32219', '#000000'], sport: 'football', league: 'Bundesliga', city: 'Leverkusen' },
  stuttgart: { id: 'stuttgart', name: 'VfB Stuttgart', initials: 'VfB', colors: ['#FFFFFF', '#E32219'], sport: 'football', league: 'Bundesliga', city: 'Stuttgart' },
  leipzig: { id: 'leipzig', name: 'RB Leipzig', initials: 'RBL', colors: ['#DD0741', '#001F47'], sport: 'football', league: 'Bundesliga', city: 'Leipzig' },
  wolfsburg: { id: 'wolfsburg', name: 'VfL Wolfsburg', initials: 'WOB', colors: ['#65B32E', '#FFFFFF'], sport: 'football', league: 'Bundesliga', city: 'Wolfsburg' },
  frankfurt: { id: 'frankfurt', name: 'Eintracht Frankfurt', initials: 'SGE', colors: ['#E1000F', '#000000'], sport: 'football', league: 'Bundesliga', city: 'Frankfurt' },

  // ---------------- Fußball: Premier League
  liverpool: { id: 'liverpool', name: 'Liverpool FC', initials: 'LIV', colors: ['#C8102E', '#FFFFFF'], sport: 'football', league: 'Premier League', motto: "You'll Never Walk Alone", city: 'Liverpool' },
  mancity: { id: 'mancity', name: 'Manchester City', initials: 'MCI', colors: ['#6CABDD', '#FFFFFF'], sport: 'football', league: 'Premier League', city: 'Manchester' },
  arsenal: { id: 'arsenal', name: 'Arsenal FC', initials: 'ARS', colors: ['#EF0107', '#FFFFFF'], sport: 'football', league: 'Premier League', city: 'London' },
  astonvilla: { id: 'astonvilla', name: 'Aston Villa', initials: 'AVL', colors: ['#670E36', '#95BFE5'], sport: 'football', league: 'Premier League', city: 'Birmingham' },

  // ---------------- Fußball: La Liga
  realmadrid: { id: 'realmadrid', name: 'Real Madrid', initials: 'RMA', colors: ['#FEBE10', '#00529F'], sport: 'football', league: 'La Liga', motto: '¡Hala Madrid!', city: 'Madrid' },
  barcelona: { id: 'barcelona', name: 'FC Barcelona', initials: 'BAR', colors: ['#A50044', '#EDBB00'], sport: 'football', league: 'La Liga', city: 'Barcelona' },
  atletico: { id: 'atletico', name: 'Atlético Madrid', initials: 'ATM', colors: ['#CB3524', '#FFFFFF'], sport: 'football', league: 'La Liga', city: 'Madrid' },

  // ---------------- Formel 1 (Fahrer als Entitäten)
  verstappen: { id: 'verstappen', name: 'Max Verstappen', initials: 'VER', colors: ['#1E3A8A', '#FFD700'], sport: 'f1', league: 'Formel 1', city: 'Red Bull', isAthlete: true },
  norris: { id: 'norris', name: 'Lando Norris', initials: 'NOR', colors: ['#FF8000', '#000000'], sport: 'f1', league: 'Formel 1', city: 'McLaren', isAthlete: true },
  piastri: { id: 'piastri', name: 'Oscar Piastri', initials: 'PIA', colors: ['#FF8000', '#003F5C'], sport: 'f1', league: 'Formel 1', city: 'McLaren', isAthlete: true },
  leclerc: { id: 'leclerc', name: 'Charles Leclerc', initials: 'LEC', colors: ['#DC0000', '#FFF200'], sport: 'f1', league: 'Formel 1', city: 'Ferrari', isAthlete: true },
  hamilton: { id: 'hamilton', name: 'Lewis Hamilton', initials: 'HAM', colors: ['#00D2BE', '#000000'], sport: 'f1', league: 'Formel 1', city: 'Ferrari', isAthlete: true },
  russell: { id: 'russell', name: 'George Russell', initials: 'RUS', colors: ['#00D2BE', '#C0C0C0'], sport: 'f1', league: 'Formel 1', city: 'Mercedes', isAthlete: true },
  mercedes: { id: 'mercedes', name: 'Mercedes-AMG F1', initials: 'MER', colors: ['#00D2BE', '#000000'], sport: 'f1', league: 'Formel 1', city: 'Brackley' },
  ferrari: { id: 'ferrari', name: 'Scuderia Ferrari', initials: 'FER', colors: ['#DC0000', '#FFF200'], sport: 'f1', league: 'Formel 1', city: 'Maranello' },

  // ---------------- NBA
  lakers: { id: 'lakers', name: 'Los Angeles Lakers', initials: 'LAL', colors: ['#552583', '#FDB927'], sport: 'nba', league: 'NBA', motto: 'Lake Show', city: 'Los Angeles' },
  celtics: { id: 'celtics', name: 'Boston Celtics', initials: 'BOS', colors: ['#007A33', '#FFFFFF'], sport: 'nba', league: 'NBA', city: 'Boston' },
  warriors: { id: 'warriors', name: 'Golden State Warriors', initials: 'GSW', colors: ['#1D428A', '#FFC72C'], sport: 'nba', league: 'NBA', city: 'San Francisco' },
  nuggets: { id: 'nuggets', name: 'Denver Nuggets', initials: 'DEN', colors: ['#0E2240', '#FEC524'], sport: 'nba', league: 'NBA', city: 'Denver' },

  // ---------------- NFL
  chiefs: { id: 'chiefs', name: 'Kansas City Chiefs', initials: 'KC', colors: ['#E31837', '#FFB81C'], sport: 'nfl', league: 'NFL', motto: 'Chiefs Kingdom', city: 'Kansas City' },
  eagles: { id: 'eagles', name: 'Philadelphia Eagles', initials: 'PHI', colors: ['#004C54', '#A5ACAF'], sport: 'nfl', league: 'NFL', city: 'Philadelphia' },
  niners: { id: 'niners', name: 'San Francisco 49ers', initials: 'SF', colors: ['#AA0000', '#B3995D'], sport: 'nfl', league: 'NFL', city: 'San Francisco' },
  bills: { id: 'bills', name: 'Buffalo Bills', initials: 'BUF', colors: ['#00338D', '#C60C30'], sport: 'nfl', league: 'NFL', city: 'Buffalo' },
  cowboys: { id: 'cowboys', name: 'Dallas Cowboys', initials: 'DAL', colors: ['#041E42', '#869397'], sport: 'nfl', league: 'NFL', city: 'Dallas' },
  ravens: { id: 'ravens', name: 'Baltimore Ravens', initials: 'BAL', colors: ['#241773', '#9E7C0C'], sport: 'nfl', league: 'NFL', city: 'Baltimore' },

  // ---------------- Tennis (ATP)
  djokovic: { id: 'djokovic', name: 'Novak Djokovic', initials: 'DJO', colors: ['#0B5394', '#FFFFFF'], sport: 'tennis', league: 'ATP', isAthlete: true },
  alcaraz: { id: 'alcaraz', name: 'Carlos Alcaraz', initials: 'ALC', colors: ['#E76F00', '#FFFFFF'], sport: 'tennis', league: 'ATP', isAthlete: true },
  sinner: { id: 'sinner', name: 'Jannik Sinner', initials: 'SIN', colors: ['#1B5E20', '#FFFFFF'], sport: 'tennis', league: 'ATP', isAthlete: true },
  medvedev: { id: 'medvedev', name: 'Daniil Medvedev', initials: 'MED', colors: ['#B71C1C', '#FFFFFF'], sport: 'tennis', league: 'ATP', isAthlete: true },
};

export interface Athlete {
  id: string;
  name: string;
  role: string;
  teamId: string;
  sport: Sport;
}

export const ATHLETES: Record<string, Athlete> = {
  kane: { id: 'kane', name: 'Harry Kane', role: 'Stürmer', teamId: 'bayern', sport: 'football' },
  musiala: { id: 'musiala', name: 'Jamal Musiala', role: 'Offensiv', teamId: 'bayern', sport: 'football' },
  salah: { id: 'salah', name: 'Mohamed Salah', role: 'Flügel', teamId: 'liverpool', sport: 'football' },
  bellingham: { id: 'bellingham', name: 'Jude Bellingham', role: 'Mittelfeld', teamId: 'realmadrid', sport: 'football' },
  verstappenA: { id: 'verstappenA', name: 'Max Verstappen', role: 'Fahrer', teamId: 'verstappen', sport: 'f1' },
  hamiltonA: { id: 'hamiltonA', name: 'Lewis Hamilton', role: 'Fahrer', teamId: 'hamilton', sport: 'f1' },
  djokovicA: { id: 'djokovicA', name: 'Novak Djokovic', role: 'Tennisprofi', teamId: 'djokovic', sport: 'tennis' },
  lebron: { id: 'lebron', name: 'LeBron James', role: 'Forward', teamId: 'lakers', sport: 'nba' },
  mahomes: { id: 'mahomes', name: 'Patrick Mahomes', role: 'Quarterback', teamId: 'chiefs', sport: 'nfl' },
  allen: { id: 'allen', name: 'Josh Allen', role: 'Quarterback', teamId: 'bills', sport: 'nfl' },
};

export function getTeam(id: string): Team | undefined {
  return TEAMS[id];
}
