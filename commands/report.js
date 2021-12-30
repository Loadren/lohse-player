const Command = require("../structures/command.js");
const {MessageActionRow, MessageButton} = require('discord.js');

module.exports = new Command({
	name: "report",
	aliases: [],
	description: "Reports a bug or make a suggestion",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
       
		let row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('buttoncontrol_bug_report')
                    .setLabel('Report a bug')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('buttoncontrol_feature_suggestion')
                    .setLabel('Suggest a feature')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId('buttoncontrol_cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
            )

			await message.channel.send({
            embeds: [
                {
                    title: `Creating ticket`,
                    description: `Are you reporting a **bug** or suggesting a **feature**?`,
                    color: 0x44b868,
                }
            ],
            components: [row]
        });
	}
});