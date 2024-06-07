export type StartEntrant = {
  id: string;
  name: string;
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
  newPlayerOneScore: number;
  newPlayerTwoScore: number;
  winnerId?: number;
};

export type StartSetReportDataGame = {
  gameNum: number;
  winnerId: number;
};
