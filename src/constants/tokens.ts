/**
 * Design-Tokens für den SPORT GOAL Prototyp.
 * Farben & Maße sind am Design-Bild orientiert (Dark Mode, satte rote Akzentfarbe,
 * tief-blauer Hintergrund). Eigene Datei, damit der Template-Code unangetastet bleibt.
 */

export const C = {
  // Hintergründe (tiefes Marineblau)
  bg: '#080C18',
  bgTop: '#0E1730',
  surface: '#131C32',
  surfaceAlt: '#0E1728',
  surfaceElevated: '#1C2746',
  border: '#22304E',
  borderSoft: '#19243E',

  // Akzent (kräftiges Rot wie im Bild)
  accent: '#E2001A',
  accentBright: '#FF1A33',
  accentDark: '#9E0012',
  accentSoft: 'rgba(226,0,26,0.16)',
  accentGlow: 'rgba(226,0,26,0.55)',

  // Text
  text: '#FFFFFF',
  textDim: '#9FAAC0',
  textFaint: '#5C6A85',

  // Status / Signale
  green: '#2BD46A',
  yellow: '#F5B33B',
  orange: '#FF7A1A',
  red: '#EF4444',
  live: '#FF2D2D',
  gold: '#F5B301',
  blue: '#3B82F6',
} as const;

export const S = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const R = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

export const F = {
  h1: 30,
  h2: 22,
  h3: 18,
  body: 15,
  small: 13,
  tiny: 11,
} as const;

/** Weicher Schatten für Karten (web: boxShadow, nativ: elevation). */
export const SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  elevation: 6,
} as const;

/** Roter Glow (z. B. hinter dem Wappen im Hero). */
export const GLOW = {
  shadowColor: C.accent,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.9,
  shadowRadius: 22,
  elevation: 10,
} as const;
