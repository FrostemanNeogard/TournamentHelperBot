import "dotenv/config";
import { START_API_URL } from "./config";
import { StartPlayer, StartSet } from "../__types/startgg";

const { START_API_KEY } = process.env;

export function getStartSlugFromStartURL(startURL: string): string {
  const parsedUrl = new URL(startURL);
  const path = parsedUrl.pathname.replace(/^\/|\/$/g, "");
  return path;
}

export async function getStartEventIdFromStartSlug(
  startSlug: string
): Promise<string> {
  const query = `
      query getEventId($slug: String) {
        event(slug: $slug) {
          id
          name
        }
      },`;

  const variables = {
    slug: startSlug,
  };

  const data = await fetchStartApi(query, variables);
  return data.data.event.id;
}

export async function getStartEntrantsFromEventId(
  eventId: string
): Promise<StartPlayer[]> {
  const query = `
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

  const variables = {
    eventId: eventId,
    page: "1",
    perPage: "8",
  };

  const data = await fetchStartApi(query, variables);
  return data.data.event.standings.nodes;
}

export async function getStartSetsFromEventId(eventId: string): Promise<StartSet[]> {
  const query = `
query EventStandings($eventId: ID!, $page: Int, $perPage: Int) {
  event(id: $eventId) {
    id
    name
    state
    sets(page: $page, perPage: $perPage) {
      nodes {
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
  const variables = {
    eventId: eventId,
  };
  const data = await fetchStartApi(query, variables);

  const formattedSets: StartSet[] = data.data.event.sets.nodes.map(
    (tournamentSet: { [key: string]: any }) => {
      return {
        stream: {
          enabled: tournamentSet.stream?.enabled,
          link: `https://www.twitch.tv/${tournamentSet.stream?.streamName}`,
        },
        round: tournamentSet.round,
        state: tournamentSet.state,
        players: tournamentSet.slots.map((player: { [key: string]: any }) => {
          if (player.standing == null || player.entrant == null) {
            return;
          }
          return {
            score: player.standing.stats.score.value ?? -1,
            name: player.entrant.name,
          };
        }),
      };
    }
  );

  return formattedSets;
}

export async function fetchStartApi(
  query: string,
  variables: { [key: string]: any }
): Promise<{ [key: string]: any }> {
  const response = await fetch(START_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + START_API_KEY,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  });

  const data = await response.json();
  return data;
}
