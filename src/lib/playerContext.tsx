"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PlayerName = "Zadie" | "Stella";

export interface PlayerInfo {
  name: PlayerName;
  avatar: string;
}

interface PlayerContextValue {
  player: PlayerInfo | null;
  setPlayer: (player: PlayerInfo) => void;
  clearPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextValue>({
  player: null,
  setPlayer: () => {},
  clearPlayer: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerInfo | null>(null);

  return (
    <PlayerContext.Provider
      value={{
        player,
        setPlayer,
        clearPlayer: () => setPlayer(null),
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  return useContext(PlayerContext);
}
