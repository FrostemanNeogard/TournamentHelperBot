const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const { main_color } = require("../../config.json");
const {
  getStartSlugFromStartURL,
  getStartEventIdFromStartSlug,
  getStartEntrantsFromEventId,
} = require("../../util/functions");

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

    const startSlug = getStartSlugFromStartURL(startURL);
    const startEventId = await getStartEventIdFromStartSlug(startSlug);
    const entrants = await getStartEntrantsFromEventId(startEventId);

    const fields = entrants.map((player) => {
      return {
        name: player.placement.toString() ?? "?",
        value: player.entrant.name ?? "?",
      };
    });

    const responseEmbed = new EmbedBuilder()
      .setColor(main_color)
      .setTitle("TOP 8")
      .setFields(fields);

    return await interaction.reply({ embeds: [responseEmbed] });
  },
};
