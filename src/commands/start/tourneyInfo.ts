import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import {
  getStartEntrantsFromEventId,
  getStartEventIdFromStartSlug,
  getStartSetsFromEventId,
  getStartSlugFromStartURL,
} from "../../util/functions";
import { COLORS } from "../../util/config";
import { StartPlayer, StartSet } from "../../__types/startgg";
import { startURLRegex } from "../../util/contants";

@Discord()
export class TourneyInfo {
  @Slash({
    description: "Get info from a given tournament",
  })
  async tourneyinfo(
    @SlashOption({
      description: "Link to a start.gg tournament.",
      name: "tournamentlink",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    startURL: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const isValidTournamentLink = startURLRegex.test(startURL);
    if (!isValidTournamentLink) {
      await interaction.reply(
        "Your start.gg URL appears to be invalid. Please double check the URL and try again."
      );
      return;
    }

    const startSlug = getStartSlugFromStartURL(startURL);
    const startEventId = await getStartEventIdFromStartSlug(startSlug);
    const entrants = await getStartEntrantsFromEventId(startEventId);

    const fields = entrants.map((player: StartPlayer) => {
      return {
        name: player.placement.toString() ?? "?",
        value: player.entrant.name ?? "?",
      };
    });

    const responseEmbed = new EmbedBuilder()
      .setColor(COLORS.main)
      .setTitle("Standings")
      .setFields(fields);

    await interaction.reply({ embeds: [responseEmbed] });
  }

  @Slash({
    description: "Get the event id from a given tournament link",
  })
  async tourneyid(
    @SlashOption({
      description: "Link to a start.gg tournament.",
      name: "tournamentlink",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    startURL: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const isValidTournamentLink = startURLRegex.test(startURL);
    if (!isValidTournamentLink) {
      await interaction.reply(
        "Your start.gg URL appears to be invalid. Please double check the URL and try again."
      );
      return;
    }

    const startSlug = getStartSlugFromStartURL(startURL);
    const startEventId = await getStartEventIdFromStartSlug(startSlug);

    await interaction.reply(`The id for the given tournament is: ${startEventId}`);
  }

  @Slash({
    description: "Get information of a given set",
  })
  async setinfo(
    @SlashOption({
      description: "Link to a start.gg tournament.",
      name: "tournamentlink",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    startURL: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const isValidTournamentLink = startURLRegex.test(startURL);
    if (!isValidTournamentLink) {
      await interaction.reply(
        "Your start.gg URL appears to be invalid. Please double check the URL and try again."
      );
      return;
    }

    const startSlug = getStartSlugFromStartURL(startURL);
    const eventId = await getStartEventIdFromStartSlug(startSlug);
    const tournamentSets: StartSet[] = await getStartSetsFromEventId(eventId);
    // console.log(tournamentSets);
    const tournamentSet: StartSet = tournamentSets[1];

    const responseEmbed = new EmbedBuilder()
      .setTitle(`Set data for ${tournamentSet.id.toString()}`)
      .setColor(COLORS.main)
      .setFields(
        {
          name: tournamentSet.players[0].name ?? "N/A",
          value: tournamentSet.players[0].score.toString(),
          inline: true,
        },
        {
          name: tournamentSet.players[1].name ?? "N/A",
          value: tournamentSet.players[1].score.toString(),
          inline: true,
        },
        {
          name: "Stream Link",
          value: tournamentSet.stream.link ?? "Stream not enabled.",
        }
      );

    await interaction.reply({ embeds: [responseEmbed] });
  }
}
