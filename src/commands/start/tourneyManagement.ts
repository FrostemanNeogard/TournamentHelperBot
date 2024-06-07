import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { resetSetById } from "../../util/functions";
import { COLORS } from "../../util/config";
import { GraphqlError } from "../../__types/startgg";

@Discord()
export class TourneyManagement {
  readonly startURLRegex: RegExp =
    /^https:\/\/www\.start\.gg\/tournament\/[^\/]+\/event\/[^\/]+\/?$/;

  @Slash({
    description: "Update the data for a given set by ID.",
  })
  async updateset(
    @SlashOption({
      description: "Link to a start.gg tournament.",
      name: "tournamentlink",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    startURL: string,
    @SlashOption({
      description: "ID of the set you want to update.",
      name: "setid",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    setId: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const isValidTournamentLink = this.startURLRegex.test(startURL);
    if (!isValidTournamentLink) {
      await interaction.reply(
        "Your start.gg URL appears to be invalid. Please double check the URL and try again."
      );
      return;
    }

    await interaction.reply("This command has not been implemented yet.");
  }

  @Slash({
    description: "Reset a given set by ID.",
  })
  async resetset(
    @SlashOption({
      description: "ID of the set you want to reset.",
      name: "setid",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    setId: string,
    interaction: CommandInteraction
  ): Promise<void> {
    const responseEmbed = new EmbedBuilder();

    const errors: GraphqlError = await resetSetById(setId);
    if (errors) {
      responseEmbed
        .setColor(COLORS.danger)
        .setTitle("Reset Set")
        .setFields({
          name: "An error occurred",
          value: errors.errors[0].message ?? "No error message received",
        });
      await interaction.reply({ embeds: [responseEmbed] });
      return;
    }

    responseEmbed
      .setColor(COLORS.main)
      .setTitle("Success")
      .setFooter({ text: `Set ID: ${setId}` })
      .setFields({
        name: "Success!",
        value: "The set was reset successfully.",
      });
    await interaction.reply({ embeds: [responseEmbed] });
  }
}
