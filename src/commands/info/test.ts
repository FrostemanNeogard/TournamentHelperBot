import { ApplicationCommandType, CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export default {
  name: "ping",
  type: ApplicationCommandType.User,
  data: new SlashCommandBuilder().setName("ping").setDescription(`Ping this bot`),
  async execute(interaction: CommandInteraction) {
    return await interaction.reply("Pong!");
  },
};
