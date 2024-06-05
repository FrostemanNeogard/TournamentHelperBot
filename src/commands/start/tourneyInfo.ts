import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import {
  getStartEntrantsFromEventId,
  getStartEventIdFromStartSlug,
  getStartSlugFromStartURL,
} from "../../util/functions";
import { COLORS } from "../../util/config";
import { StartPlayer } from "../../__types/startgg";

@Discord()
export class SteamInvite {
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
    const startURLRegex =
      /^https:\/\/www\.start\.gg\/tournament\/[^\/]+\/event\/[^\/]+\/?$/;
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
    const startURLRegex =
      /^https:\/\/www\.start\.gg\/tournament\/[^\/]+\/event\/[^\/]+\/?$/;
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
}
