import "dotenv/config";
import { Events, IntentsBitField, Interaction } from "discord.js";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";

const { TOKEN, DEV, TEST_GUILD_ID } = process.env;

const client = new Client({
  botId: "test",
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  botGuilds: DEV ? [TEST_GUILD_ID ?? ""] : undefined,
});

client.once(Events.ClientReady, async () => {
  await client.initApplicationCommands();
  console.log(`${client.user?.username} is now online!`);
});

client.on(Events.InteractionCreate, (interaction: Interaction) => {
  console.log(`Interaction`);
  client.executeInteraction(interaction);
});

async function start() {
  console.log("importing");
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  console.log("checking");
  if (!TOKEN) {
    throw Error("Could not find TOKEN in your environment");
  }

  console.log("logging");
  await client.login(TOKEN);

  console.log("logged");
}

console.log("starting");
void start();
