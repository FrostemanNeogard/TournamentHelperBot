export type StartEntrant = {
  id: number;
  name: string;
};

export type GraphqlStartEntrant = {
  entrant: StartEntrant;
};

export type StartPlayer = {
  placement: number;
  entrant: StartEntrant;
};

export type StartSet = {
  id: number;
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

type GraphqlErrorContent = { [key: string]: any };

export type GraphqlError = { errors: GraphqlErrorContent[] } | undefined;

export type StartSetReportData = {
  playerOne: {
    newScore: number;
    id: number;
  };
  playerTwo: {
    newScore: number;
    id: number;
  };
  winnerId?: number;
};

export type StartSetReportDataGame = {
  gameNum: number;
  winnerId: number;
};
