const {
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");

const axios = require("axios");

const { main_color } = require("../../config.json");

require("dotenv").config();
const STEAM_API_KEY = process.env.STEAM_API_KEY;

module.exports = {
  name: "steaminvite",
  data: new SlashCommandBuilder()
    .setName("steaminvite")
    .setDescription(
      `Creates a clickable button to accept a steam invite from a URL.`
    )
    // .addStringOption((option) =>
    //   option
    //     .setName("invitelink")
    //     .setDescription('The Steam invite link. Starts with "steam://"')
    //     .setRequired(true)
    // )
    .addStringOption((option) =>
      option
        .setName("profileurl")
        .setDescription("Link to your steam profile.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("neverexpire")
        .setDescription(
          "Decide if you want the invite to not expire after a minute."
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    // const steamURL = interaction.options.getString("invitelink");
    const steamURLRegex = /^steam:\/\/joinlobby\/\d+\/\d+$/;
    const steamIPRegex = /^steam:\/\/connect\/(\d{1,3}\.){3}\d{1,3}:\d+$/;
    // const isSteamURLValid = steamURLRegex.test(steamURL);

    // if (!isSteamURLValid) {
    //   return await interaction.reply(
    //     "Your steam URL appears to be invalid. Please double check the URL and try again."
    //   );
    // }

    const neverExpire = interaction.options.getBoolean("neverexpire");
    const profileURL = interaction.options.getString("profileurl");
    const response = await axios.get(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&format=json&steamids=76561198202659223`
    );
    if (!response.status == 200) {
      return await interaction.reply(
        "An error ocurred. Please try again later."
      );
    }
    const data = response.data;
    const playerData = data.response.players[0];
    if (!playerData.lobbysteamid || !playerData.gameid) {
      return await interaction.reply(
        "Player appears to not be in a lobby currently."
      );
    }
    const steamURL = `steam://joinlobby/${playerData.gameid}/${playerData.lobbysteamid}/${playerData.steamid}`;

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
        time: 120_000,
      });
    } catch (e) {
      await interaction.editReply({ embeds: [timeoutEmbed], components: [] });
    }
  },
};
