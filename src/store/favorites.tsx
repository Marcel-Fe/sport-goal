/**
 * Speichert die Onboarding-Auswahl des Nutzers (Sportarten, Vereine, Spieler)
 * lokal via AsyncStorage und stellt sie der ganzen App per Context bereit.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import type { Sport } from '@/data/teams';

const STORAGE_KEY = 'sportgoal.favorites.v1';

export interface Favorites {
  sports: Sport[];
  teamIds: string[];
  playerIds: string[];
  onboarded: boolean;
}

const EMPTY: Favorites = { sports: [], teamIds: [], playerIds: [], onboarded: false };

interface FavoritesContextValue {
  favorites: Favorites;
  loading: boolean;
  primaryTeamId: string | undefined;
  save: (next: Favorites) => Promise<void>;
  reset: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorites>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavorites({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        // Prototyp: stiller Fallback auf leere Auswahl
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async (next: Favorites) => {
    setFavorites(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const reset = async () => {
    setFavorites(EMPTY);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        primaryTeamId: favorites.teamIds[0],
        save,
        reset,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
