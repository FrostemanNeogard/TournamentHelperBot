export const mutationResetSet = `
  mutation ResetSetById($setId: ID!) {
    resetSet(setId: $setId) {
      id
    }
  }`;
