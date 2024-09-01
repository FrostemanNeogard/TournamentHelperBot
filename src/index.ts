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
  try {
    client.executeInteraction(interaction);
  } catch (error) {
    console.error(
      "An error ocurred when attempting to execute interaction. Error:",
      error
    );
  }
});

async function start() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!TOKEN) {
    throw Error("Could not find TOKEN in your environment");
  }

  console.log("Logging in...");
  await client.login(TOKEN);

  console.log("Logged in!");
}

void start();
