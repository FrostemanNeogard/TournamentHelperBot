import "dotenv/config";
import { START_API_URL } from "./config";
import { StartPlayer, StartSet } from "../__types/startgg";
import {
  queryEntrantsFromEventId,
  queryEventIdFromSlug,
  querySetsFromEventId,
} from "./graphqlQueries";

const { START_API_KEY } = process.env;

export function getStartSlugFromStartURL(startURL: string): string {
  const parsedUrl = new URL(startURL);
  const path = parsedUrl.pathname.replace(/^\/|\/$/g, "");
  return path;
}

export async function getStartEventIdFromStartSlug(
  startSlug: string
): Promise<string> {
  const variables = {
    slug: startSlug,
  };

  const data = await fetchStartApi(queryEventIdFromSlug, variables);
  return data.data.event.id;
}

export async function getStartEntrantsFromEventId(
  eventId: string
): Promise<StartPlayer[]> {
  const variables = {
    eventId: eventId,
    page: "1",
    perPage: "8",
  };

  const data = await fetchStartApi(queryEntrantsFromEventId, variables);
  return data.data.event.standings.nodes;
}

export async function getStartSetsFromEventId(eventId: string): Promise<StartSet[]> {
  const variables = {
    eventId: eventId,
  };
  const data = await fetchStartApi(querySetsFromEventId, variables);

  const formattedSets: StartSet[] = data.data.event.sets.nodes.map(
    (tournamentSet: { [key: string]: any }) => {
      return {
        id: tournamentSet.id,
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
