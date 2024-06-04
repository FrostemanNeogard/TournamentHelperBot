import axios from "axios";
import "dotenv/config";
import { START_API_URL } from "./config";

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export async function getSteamInviteLinkFromProfileURL(profileURL: string) {
  const match = profileURL.match(
    /https:\/\/steamcommunity\.com\/profiles\/(\d+)\/$/
  );
  if (!match) {
    return;
  }
  const steamId = match[1];
  const response = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&format=json&steamids=${steamId}`
  );

  if (response.status != 200) {
    console.error("An error ocurred when fetching the Steam API.");
    return null;
  }

  const playerData = response.data.response.players[0];

  if (!playerData.lobbysteamid || !playerData.gameid || !playerData.lobbysteamid) {
    console.error("The player is not currently in a lobby.");
    return null;
  }

  return `steam://joinlobby/${playerData.gameid}/${playerData.lobbysteamid}/${playerData.steamid}`;
}

export function getStartSlugFromStartURL(startURL: string) {
  const parsedUrl = new URL(startURL);
  const path = parsedUrl.pathname.replace(/^\/|\/$/g, "");
  return path;
}

export async function getStartEventIdFromStartSlug(startSlug: string) {
  const response = await fetch(START_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.START_API_KEY,
    },
    body: JSON.stringify({
      query: `
      query getEventId($slug: String) {
        event(slug: $slug) {
          id
          name
        }
      },`,
      variables: {
        slug: startSlug,
      },
    }),
  });

  const data = await response.json();
  return data.data.event.id;
}

export async function getStartEntrantsFromEventId(eventId: string) {
  const response = await fetch(START_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.START_API_KEY,
    },
    body: JSON.stringify({
      query: `
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
      }`,
      variables: {
        eventId: eventId,
        page: "1",
        perPage: "8",
      },
    }),
  });

  const data = await response.json();
  return data.data.event.standings.nodes;
}
