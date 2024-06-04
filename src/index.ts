import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { readdirSync } from "fs";
import { readdir } from "fs/promises";

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

async function refreshCommands() {
  const commandCategories = await readdir(`src/commands`);
  commandCategories.forEach((category) => {
    let commands = getFiles(`src/commands/${category}`, ".ts");

    commands.forEach((file) => {
      delete require.cache[require.resolve(`./commands/${category}/${file}`)];
      const command = require(`./commands/${category}/${file}`);
      client?.application?.commands.set(command.name, command);
    });
  });
}

client.on("ready", async (c) => {
  await refreshCommands();
  console.log(`${client.user?.username} is now online!`);
  console.log(await client.application?.commands.fetch());
});

client.login(process.env.TOKEN);
