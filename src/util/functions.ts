import { Client } from "discord.js";
import { readdirSync } from "fs";
import { readdir } from "fs/promises";

export function getFiles(path: string, ending: string) {
  return readdirSync(path).filter((f) => f.endsWith(ending));
}

export async function refreshCommands(client: Client) {
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
