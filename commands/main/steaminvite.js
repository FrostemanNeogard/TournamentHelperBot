const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

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

    const BASE_URL = "http://127.0.0.1:5500/test.html?steamurl=" + steamURL;

    const responseEmbed = new EmbedBuilder().setFields({
      name: "You have been invited to a steam lobby!",
      value: " ",
    });

    console.log(BASE_URL);
    const joinButton = new ButtonBuilder()
      .setLabel("Join Lobby")
      .setURL(BASE_URL)
      .setStyle(ButtonStyle.Link);

    const declineButton = new ButtonBuilder()
      .setCustomId("decline")
      .setLabel("Decline")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(joinButton, declineButton);

    await interaction.reply({ embeds: [responseEmbed], components: [row] });
  },
};
