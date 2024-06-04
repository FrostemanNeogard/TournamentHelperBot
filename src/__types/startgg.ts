export type StartEntrant = {
  id: string;
  name: string;
};

export type StartPlayer = {
  placement: number;
  entrant: StartEntrant;
};
