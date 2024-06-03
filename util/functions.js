const fs = require("fs");
const axios = require("axios");
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

module.exports = {
  getFiles,
  capitalizeFirstLetters,
  getSteamInviteLinkFromProfileURL,
};
