export const mutationResetSet = `
  mutation ResetSetById($setId: ID!) {
    resetSet(setId: $setId) {
      id
    }
  }`;

export const mutationReportSet = `
  mutation UpdateSetById($setId: ID!, $winnerId: ID, $gameData: [BracketSetGameDataInput]) {
    reportBracketSet(
      setId: $setId
      winnerId: $winnerId
      gameData: $gameData
    ) {
      fullRoundText
    }
  }`;
