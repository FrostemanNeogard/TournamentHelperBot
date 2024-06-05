import "dotenv/config";
import { START_API_URL } from "./config";

const { START_API_KEY } = process.env;

export function getStartSlugFromStartURL(startURL: string) {
  const parsedUrl = new URL(startURL);
  const path = parsedUrl.pathname.replace(/^\/|\/$/g, "");
  return path;
}

export async function getStartEventIdFromStartSlug(startSlug: string) {
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

export async function getStartEntrantsFromEventId(eventId: string) {
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

export async function fetchStartApi(
  query: string,
  variables: { [key: string]: any }
) {
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
