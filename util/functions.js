const fs = require("fs");
const { Exception } = require("sass");
require("dotenv").config();
const STEAM_API_KEY = process.env.STEAM_API_KEY;

const getFiles = (path, ending) => {
  return fs.readdirSync(path).filter((f) => f.endsWith(ending));
};

const capitalizeFirstLetters = (string) => {
  const words = string.split(" ");
  const output = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const capitalizedWord = word[0].toUpperCase() + word.substring(1);
    output.push(capitalizedWord);
  }
  return output.join(" ");
};

const getSteamInviteLinkFromProfileURL = async (profileURL) => {
  const steamId = 76561198202659223;
  const response = await axios.get(
    `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&format=json&steamids=${steamId}`
  );

  if (!response.status == 200) {
    throw new Exception("An error ocurred. Please try again later.");
  }

  const playerData = response.data.response.players[0];

  if (!playerData.lobbysteamid || !playerData.gameid) {
    throw new Exception("Player appears to not be in a lobby currently.");
  }

  return `steam://joinlobby/${playerData.gameid}/${playerData.lobbysteamid}/${playerData.steamid}`;
};

module.exports = {
  getFiles,
  capitalizeFirstLetters,
  getSteamInviteLinkFromProfileURL,
};
