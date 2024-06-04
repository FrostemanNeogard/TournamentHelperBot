import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function getFiles(path: string, ending: string) {
  return readdirSync(path).filter((f) => f.endsWith(ending));
}

readdirSync("./commands/").forEach((category) => {
  let commands = getFiles(`./commands/${category}`, ".js");

  commands.forEach((file) => {
    delete require.cache[require.resolve(`../commands/${category}/${file}`)];

    const command = require(`../commands/${category}/${file}`);
    client?.application?.commands.set(command.name, command);
  });
});

client.on("ready", async (c) => {
  console.log(`${client.user?.username} is now online!`);
  console.log(await client.application?.commands.fetch());
});

client.login(process.env.TOKEN);
