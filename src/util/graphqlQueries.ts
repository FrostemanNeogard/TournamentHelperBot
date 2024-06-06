export const queryEventIdFromSlug = `
  query getEventId($slug: String) {
    event(slug: $slug) {
      id
      name
    }
  }`;

export const queryEntrantsFromEventId = `
  query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
    event(id: $eventId) {
      id
      name
      standings(query: {
        perPage: $perPage,
        page: $page
      }){
        nodes {
          placement
          entrant {
            id
            name
          }
        }
      }
    }
  }`;

export const querySetsFromEventId = `
  query EventStandings($eventId: ID!, $page: Int, $perPage: Int) {
    event(id: $eventId) {
      id
      name
      state
      sets(page: $page, perPage: $perPage) {
        nodes {
          id
          stream {
            enabled
            streamName
            streamSource
          }
          round
          state
          slots(includeByes: false) {
            standing {
              stats {
                score {
                  value
                }
              }
            }
            entrant {
              name
            }
          }
        }
      }
    }
  }`;
