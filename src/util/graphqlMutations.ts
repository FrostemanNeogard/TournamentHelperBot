export const mutationResetSet = `
  mutation ResetSetById($setId: ID!) {
    resetSet(setId: $setId) {
      id
    }
  }`;

export const mutationReportSet = `
  mutation UpdateSetById($setId: ID!, $winnerId: ID, $gameNum: Int!, $entrant1Score: Int, $entrant2Score: Int) {
    reportBracketSet(setId: $setId, winnerId: $winnerId gameData: {
      gameNum: $gameNum
      entrant1Score: $entrant1Score
      entrant2Score: $entrant2Score
    }) {
      fullRoundText
    }
  }`;
