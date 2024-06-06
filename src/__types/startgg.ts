export type StartEntrant = {
  id: string;
  name: string;
};

export type StartPlayer = {
  placement: number;
  entrant: StartEntrant;
};

export type StartSet = {
  stream: {
    enabled: boolean;
    link: string;
  };
  round: number;
  state: number;
  players: {
    name: string;
    score: number;
  }[];
};
