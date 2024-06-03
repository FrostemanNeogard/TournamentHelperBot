const fs = require("fs");
const axios = require("axios");
const fetch = require("node-fetch");
const { start_api_url } = require("../config.json");

require("dotenv").config();
const STEAM_API_KEY = process.env.STEAM_API_KEY;

function getFiles(path, ending) {
  return fs.readdirSync(path).filter((f) => f.endsWith(ending));
}

function capitalizeFirstLetters(string) {
  const words = string.split(" ");
  const output = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const capitalizedWord = word[0].toUpperCase() + word.substring(1);
    output.push(capitalizedWord);
  }
  return output.join(" ");
}

async function getSteamInviteLinkFromProfileURL(profileURL) {
  const match = profileURL.match(
    /https:\/\/steamcommunity\.com\/profiles\/(\d+)\/$/
  );
  const steamId = match[1];
  const response = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&format=json&steamids=${steamId}`
  );

  if (!response.status == 200) {
    console.error("An error ocurred when fetching the Steam API.");
    return null;
  }

  const playerData = response.data.response.players[0];

  if (
    !playerData.lobbysteamid ||
    !playerData.gameid ||
    !playerData.lobbysteamid
  ) {
    console.error("The player is not currently in a lobby.");
    return null;
  }

  return `steam://joinlobby/${playerData.gameid}/${playerData.lobbysteamid}/${playerData.steamid}`;
}

function getStartSlugFromStartURL(startURL) {
  const parsedUrl = new URL(startURL);
  const path = parsedUrl.pathname.replace(/^\/|\/$/g, "");
  return path;
}

async function getStartEventIdFromStartSlug(startSlug) {
  const response = await fetch(start_api_url, {
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

async function getStartEntrantsFromEventId(eventId) {
  const response = await fetch(start_api_url, {
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

module.exports = {
  getFiles,
  capitalizeFirstLetters,
  getSteamInviteLinkFromProfileURL,
  getStartSlugFromStartURL,
  getStartEventIdFromStartSlug,
  getStartEntrantsFromEventId,
};
