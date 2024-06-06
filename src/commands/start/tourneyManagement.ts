import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";

@Discord()
export class TourneyManagement {
  readonly startURLRegex: RegExp =
    /^https:\/\/www\.start\.gg\/tournament\/[^\/]+\/event\/[^\/]+\/?$/;

  @Slash({
    description: "Update the set ",
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
}
