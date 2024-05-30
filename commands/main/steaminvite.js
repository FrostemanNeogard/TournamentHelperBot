const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const { main_color } = require("../../config.json");

module.exports = {
  name: "steaminvite",
  data: new SlashCommandBuilder()
    .setName("steaminvite")
    .setDescription(
      `Creates a clickable button to accept a steam invite from a URL.`
    )
    .addStringOption((option) =>
      option
        .setName("invitelink")
        .setDescription('The Steam invite link. Starts with "steam://"')
        .setRequired(true)
    ),
  async execute(interaction) {
    const steamURL = interaction.options.getString("invitelink");
    const steamURLRegex = /^steam:\/\/joinlobby\/\d+\/\d+$/;
    const isSteamURLValid = steamURLRegex.test(steamURL);

    if (!isSteamURLValid) {
      return await interaction.reply(
        "Your steam URL appears to be invalid. Please double check the URL and try again."
      );
    }

    const BASE_URL =
      "https://frostemanneogard.github.io/uri-redirector/?uri=" + steamURL;
    const responseEmbed = new EmbedBuilder()
      .setTitle("Steam Invitation")
      .setColor(main_color)
      .setFields({
        name: "You have been invited to a steam lobby!",
        value: " ",
      });
    const joinButton = new ButtonBuilder()
      .setLabel("Join Lobby")
      .setURL(BASE_URL)
      .setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder().addComponents(joinButton);
    const message = await interaction.reply({
      embeds: [responseEmbed],
      components: [row],
    });
    const collectorFilter = (i) => i.user.id === interaction.user.id;
    const timeoutEmbed = new EmbedBuilder()
      .setTitle("Steam Invitation")
      .setColor(main_color)
      .setFields({
        name: "This invite has expired.",
        value: " ",
      });

    try {
      await message.awaitMessageComponent({
        filter: collectorFilter,
        time: 60_000,
      });
    } catch (e) {
      await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
    }
  },
};
