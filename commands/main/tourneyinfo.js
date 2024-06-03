const { SlashCommandBuilder } = require("discord.js");

const { main_color } = require("../../config.json");

module.exports = {
  name: "tourneyinfo",
  data: new SlashCommandBuilder()
    .setName("tourneyinfo")
    .setDescription(`Get info from a given tournament`)
    .addStringOption((option) =>
      option
        .setName("tournamentlink")
        .setDescription("Link to a start.gg tournament.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const startURL = interaction.options.getString("tournamentlink");
    const startURLRegex =
      /^https:\/\/www\.start\.gg\/tournament\/[^\/]+\/event\/[^\/]+\/?$/;
    const isValidTournamentLink = startURLRegex.test(startURL);
    if (!isValidTournamentLink) {
      return await interaction.reply(
        "Your start.gg URL appears to be invalid. Please double check the URL and try again."
      );
    }

    return await interaction.reply("Start.gg URL is valid!");
  },
};
