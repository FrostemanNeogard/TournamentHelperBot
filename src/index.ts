import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { refreshCommands } from "./util/functions";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", async (c) => {
  await refreshCommands(c);
  console.log(`${client.user?.username} is now online!`);
  console.log(await client.application?.commands.fetch());
});

client.login(process.env.TOKEN);
