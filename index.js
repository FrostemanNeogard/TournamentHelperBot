require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const TOKEN = process.env.TOKEN;

const Discord = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

let bot = {
  client,
};

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

client.loadEvents = (bot, reload) => require("./handlers/events")(bot, reload);
client.loadCommands = (bot, reload) =>
  require("./handlers/commands")(bot, reload);

client.loadEvents(bot, false);
client.loadCommands(bot, false);

module.exports = bot;

client.login(TOKEN);
