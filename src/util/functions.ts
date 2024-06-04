import { Client } from "discord.js";
import { readdirSync } from "fs";
import { readdir } from "fs/promises";
import path = require("path");

export function getFiles(path: string, ending: string) {
  return readdirSync(path).filter((f) => f.endsWith(ending));
}

export async function refreshCommands(client: Client) {
  const commandCategories = await readdir(`src/commands`);
  commandCategories.forEach((category) => {
    let commands = getFiles(`src/commands/${category}`, ".ts");

    commands.forEach(async (file) => {
      const filePath = path.join(process.cwd(), `src/commands/${category}/${file}`);
      const command = require(filePath);
      client.application!.commands.create(command.default);
    });
  });
}
