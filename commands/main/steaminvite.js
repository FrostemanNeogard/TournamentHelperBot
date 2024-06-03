const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const { main_color } = require("../../config.json");
const { getSteamInviteLinkFromProfileURL } = require("../../util/functions");

module.exports = {
  name: "steaminvite",
  data: new SlashCommandBuilder()
    .setName("steaminvite")
    .setDescription(
      `Creates a clickable button to accept a steam invite from a URL.`
    )
    .addStringOption((option) =>
      option
        .setName("profileurl")
        .setDescription(
          "Link to either your steam profile or your game session."
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("neverexpire")
        .setDescription("Decide if you want the invite to never expire.")
        .setRequired(false)
    ),
  async execute(interaction) {
    const steamURL = interaction.options.getString("profileurl");
    const steamInviteURLRegex = /^steam:\/\/joinlobby\/\d+\/\d+\/\d+$/;
    const steamProfileURLRegex =
      /^https:\/\/steamcommunity\.com\/profiles\/\d+\/$/;
    const isValidInviteLink = steamInviteURLRegex.test(steamURL);
    const isValidSteamLink = steamProfileURLRegex.test(steamURL);

    if (!isValidInviteLink && !isValidSteamLink) {
      return await interaction.reply(
        "Your steam URL appears to be invalid. Please double check the URL and try again."
      );
    }

    const inviteURL = isValidInviteLink
      ? steamURL
      : await getSteamInviteLinkFromProfileURL(steamURL);

    if (inviteURL == null) {
      return await interaction.reply(
        "Something went wrong. Please make sure the user is in a joinable lobby."
      );
    }

    const redirectURL =
      "https://frostemanneogard.github.io/uri-redirector/?uri=" + inviteURL;

    const responseEmbed = new EmbedBuilder()
      .setTitle("Steam Invitation")
      .setColor(main_color)
      .setFields({
        name: "You have been invited to a steam lobby!",
        value: " ",
      });
    const joinButton = new ButtonBuilder()
      .setLabel("Join Lobby")
      .setURL(redirectURL)
      .setStyle(ButtonStyle.Link);
    const row = new ActionRowBuilder().addComponents(joinButton);
    const message = await interaction.reply({
      embeds: [responseEmbed],
      components: [row],
    });

    const neverExpire = interaction.options.getBoolean("neverexpire");
    if (neverExpire == true) {
      return;
    }
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
        time: 300_000,
      });
    } catch (e) {
      await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
    }
  },
};
