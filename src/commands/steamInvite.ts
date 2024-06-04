import type {
  CommandInteraction,
  Interaction,
  MessageActionRowComponentBuilder,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
import { getSteamInviteLinkFromProfileURL } from "../util/functions";
import { COLORS } from "../util/config";

@Discord()
export class SteamInvite {
  @Slash({
    description: "Create a clickable button to join a steam lobby.",
  })
  async steaminvite(
    @SlashOption({
      description: "Link to either your steam profile or your game session.",
      name: "steamurl",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    steamURL: string,
    @SlashOption({
      description: "Decide if you want the invite to never expire.",
      name: "neverexpire",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    neverExpire: boolean,
    interaction: CommandInteraction
  ): Promise<void> {
    const steamInviteURLRegex = /^steam:\/\/joinlobby\/\d+\/\d+\/\d+$/;
    const steamProfileURLRegex = /^https:\/\/steamcommunity\.com\/profiles\/\d+\/$/;
    const isValidInviteLink = steamInviteURLRegex.test(steamURL);
    const isValidSteamLink = steamProfileURLRegex.test(steamURL);

    if (!isValidInviteLink && !isValidSteamLink) {
      await interaction.reply(
        "Your steam URL appears to be invalid. Please double check the URL and try again."
      );
      return;
    }

    const inviteURL = isValidInviteLink
      ? steamURL
      : await getSteamInviteLinkFromProfileURL(steamURL);

    if (inviteURL == null) {
      await interaction.reply(
        "Something went wrong. Please make sure the user is in a joinable lobby."
      );
      return;
    }

    const redirectURL =
      "https://frostemanneogard.github.io/uri-redirector/?uri=" + inviteURL;

    const responseEmbed = new EmbedBuilder()
      .setTitle("Steam Invitation")
      .setColor(COLORS.main)
      .setFields({
        name: "You have been invited to a steam lobby!",
        value: " ",
      });

    const joinButton = new ButtonBuilder()
      .setLabel("Join Lobby")
      .setURL(redirectURL)
      .setStyle(ButtonStyle.Link);
    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        joinButton
      );
    const message = await interaction.reply({
      embeds: [responseEmbed],
      components: [row],
    });

    if (neverExpire == true) {
      return;
    }

    const collectorFilter = (i: Interaction) => i.user.id === interaction.user.id;
    const timeoutEmbed = new EmbedBuilder()
      .setTitle("Steam Invitation")
      .setColor(COLORS.main)
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
  }
}
