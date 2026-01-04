
export type Player = {
  name: string;
  isImpostor: boolean;
};

export type GameSettings = {
  numPlayers: number;
  playerNames: string[];
  numImpostors: number;
  impostorProbability: number;
  wordList: string[];
  topic: string;
};

export type GameState = {
  settings: GameSettings;
  players: Player[];
  word: string;
};
