/**
 * Feste TheSportsDB-Team-IDs (idTeam) je Team. Für eventslast.php?id=<id>
 * (teamspezifische letzte Spiele) – einmalig via scripts/fetch-team-ids.js geholt.
 */
export const TEAM_DB_ID: Record<string, string> = {
  bayern: '133664',
  dortmund: '133650',
  leverkusen: '133666',
  stuttgart: '133660',
  leipzig: '134695',
  wolfsburg: '143637',
  frankfurt: '133814',
  liverpool: '133602',
  mancity: '133613',
  arsenal: '133604',
  astonvilla: '133601',
  realmadrid: '133738',
  barcelona: '133739',
  atletico: '133729',
  lakers: '134867',
  celtics: '134860',
  warriors: '134865',
  nuggets: '134885',
  chiefs: '134931',
  eagles: '134936',
  niners: '134948',
  bills: '134918',
  cowboys: '134934',
  ravens: '134922',
};

export function teamDbId(teamId?: string): string | undefined {
  return teamId ? TEAM_DB_ID[teamId] : undefined;
}
