import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { reportSetById, resetSetById } from "../../util/functions";
import { COLORS } from "../../util/config";
import { GraphqlError, StartSetReportData } from "../../__types/startgg";

@Discord()
export class TourneyManagement {
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
      .setTitle("Reset Set")
      .setFooter({ text: `Set ID: ${setId}` })
      .setFields({
        name: "Success!",
        value: "The set was reset successfully.",
      });
    await interaction.reply({ embeds: [responseEmbed] });
  }

  @Slash({
    description: "Report data for a given set by ID.",
  })
  async reportset(
    @SlashOption({
      description: "ID of the set you want to report.",
      name: "setid",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    setId: string,
    @SlashOption({
      description: "Player One's new score.",
      name: "playeronescore",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    playerOneScore: number,
    @SlashOption({
      description: "Player Two's new score.",
      name: "playertwoscore",
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    playerTwoScore: number,
    @SlashOption({
      description:
        "If set to true, will report the set as complete, otherwise only updates score",
      name: "finished",
      required: false,
      type: ApplicationCommandOptionType.Boolean,
    })
    finished: number,
    interaction: CommandInteraction
  ): Promise<void> {
    const responseEmbed = new EmbedBuilder();

    const players = {
      playerOne: {
        newScore: playerOneScore,
        id: 16836651,
      },
      playerTwo: {
        newScore: playerTwoScore,
        id: 16836650,
      },
    };

    const gameData: StartSetReportData = {
      playerOne: players.playerOne,
      playerTwo: players.playerTwo,
      winnerId: !finished
        ? undefined
        : playerOneScore > playerTwoScore
        ? players.playerOne.id
        : players.playerTwo.id,
    };

    const errors: GraphqlError = await reportSetById(setId, gameData);
    if (errors?.errors) {
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
      .setTitle("Report Set")
      .setFooter({ text: `Set ID: ${setId}` })
      .setFields({
        name: "Success!",
        value: "The set was updated successfully.",
      });
    await interaction.reply({ embeds: [responseEmbed] });
  }
}
