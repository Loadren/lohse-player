const Event = require("../structures/event.js");
const Queue = require("../commands/queue.js");
const {MessageActionRow, MessageButton, MessageEmbed} = require('discord.js');
const fetch = require('node-fetch');
const getReply = require("../structures/getReply.js");
const Github = require("../structures/github.js");

module.exports = new Event("interactionCreate", async (client, interaction) => {


	if(!interaction.guild.me.permissionsIn(interaction.channel).has(client.requiredTextPermissions)) return;

    // interaction works like "message" here except that it has some restrictions like it can't be reacted to
    // so if ever you want to customize the send calls or even turn them to reply you can safely do it
    // you can also get who pressed the button just like who send the message in messageCreate

    // apparently interactionCreate is also called when messaging so this is to verify if the interaction is a button press
    if(interaction.componentType === "BUTTON" && interaction.customId.includes("buttoncontrol")) {
        const queue = client.player.getQueue(interaction.guild);
        const _isPaused = queue?.connection?.paused;
        const embed = new MessageEmbed();
        switch(interaction.customId){
            case "buttoncontrol_play":
                if(!queue || !queue.playing) return;
                let row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('buttoncontrol_play')
                        .setLabel(_isPaused ? 'Pause' : 'Resume')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('buttoncontrol_skip')
                        .setLabel('Skip')
                        .setStyle('PRIMARY'),
                    new MessageButton()
                        .setCustomId('buttoncontrol_disconnect')
                        .setLabel('Disconnect')
                        .setStyle('DANGER'),
                    new MessageButton()
                        .setCustomId('buttoncontrol_queue')
                        .setLabel('Show queue')
                        .setStyle('SECONDARY')
                )
                let status;
                if(!_isPaused){
                    queue.setPaused(true);
                    status = "paused";
                }else{
                    queue.setPaused(false);
                    status = "resumed";
                }
                queue.npmessage.edit({
                    embeds: [
                        {
                            title: `Now playing`,
                            description: `**[${queue.current.title}](${queue.current.url})** - ${queue.current.requestedBy}\n\n${status} by ${interaction.user}`,
                            thumbnail: {
                                url: `${queue.current.thumbnail}`
                            },
                            color: _isPaused ? 0x44b868 : 0xb84e44,
                        }
                    ],
                    components: [row]
                });
                await interaction.deferUpdate();
                break;
            case "buttoncontrol_disconnect":
                if(!queue || !queue.playing) return;
                embed.setDescription(`👋 Disconnected.`);
                embed.setColor('#44b868');
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.destroy(true);
                break;
            case "buttoncontrol_skip":
                if(!queue || !queue.playing) return;
                embed.setDescription(`Skipped **[${queue.current.title}](${queue.current.url})**`);
                embed.setColor('#44b868');
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                interaction.channel.send({ embeds: [embed] });
                await interaction.deferUpdate();
                queue.skip();
                break;
            case "buttoncontrol_queue":
                if(!queue || !queue.playing) return;
                Queue.run(interaction, ["queue"], client, true);
                await interaction.deferUpdate();
                break;
            case "buttoncontrol_bug_report":
                embed.setTitle("Report a Bug");
                embed.setColor('#44b868');
                embed.setDescription("What bug do you want to report? (title of the ticket)");
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                break;
            case "buttoncontrol_feature_suggestion":
                embed.setTitle("Suggest a Feature");
                embed.setColor('#44b868');
                embed.setDescription("What feature do you want to suggest? (title of the ticket)");
                embed.setFooter(interaction.user.tag, interaction.user.displayAvatarURL());
                break;
            case "buttoncontrol_cancel":
                interaction.message.delete();
                await interaction.deferUpdate();
        }

        if(["buttoncontrol_bug_report", "buttoncontrol_feature_suggestion"].includes(interaction.customId)){

            var type = interaction.customId == "buttoncontrol_bug_report" ? "bug" : "feature";
            var user = interaction.user;

            await interaction.message.edit({ embeds: [embed], components: [] });
            await interaction.deferUpdate();
            // Get Title

            var titleMessage = await getReply(interaction.channel, user, 60);
            var title = titleMessage.content;

            if(!title) {
                interaction.channel.send({
                    embeds: [
                        {
                            description: `**${user.username}**, it's been a minute without answer. Cancelling ticket.`,
                            color: 0x44b868
                        }
                    ]
                });
                return;
            }   

            titleMessage.delete();

            // Get Description

            embed.setTitle("Describe it");
            embed.setColor('#44b868');
            embed.setDescription(`Can you describe the ${type}?`);
            embed.setFooter(user.tag, user.displayAvatarURL());

            await interaction.message.edit({ embeds: [embed] });

            var descriptionMessage = await getReply(interaction.channel, user, 180);
            var description = descriptionMessage.content;

            if(!description) {
                interaction.channel.send({
                    embeds: [
                        {
                            description: `**${user.usernam}**, it's been two minutes without answer. Cancelling ticket.`,
                            color: 0x44b868
                        }
                    ]
                });
                return;
            }

            descriptionMessage.delete();

            // Create issue

            var issueUrl = await client.github.createIssue(title, description, type.split('|'));

            // Reply created issue

            var issueMessageEmbed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(title.toString())
                .setURL(issueUrl.toString())
                .setAuthor(user.username, user.avatarURL())
                .setDescription(description.toString())
                .setThumbnail("https://i.imgur.com/2Ltc2ro.png")
                .addFields(
                    { name: 'Type', value: type }
                )
                .setTimestamp()

                await interaction.message.edit({ embeds: [issueMessageEmbed] });
        }
    }
    // Discord Together/Activities
    if (interaction.isSelectMenu() && interaction.customId === "together") {
        if(interaction.member.voice.channel) {
            try {
                await fetch(`https://discord.com/api/v8/channels/${interaction.member.voice.channel.id}/invites`, {
                    method: 'POST',
                    body: JSON.stringify({
                        max_age: 86400,
                        max_uses: 0,
                        target_application_id: interaction.values[0],
                        target_type: 2,
                        temporary: false,
                        validate: null,
                    }),
                    headers: {
                        Authorization: `Bot ${client.token}`,
                        'Content-Type': 'application/json',
                    },
                })
                  .then((res) => res.json())
                  .then((invite) => {
                    if (invite.error || !invite.code || Number(invite.code) === 50013) {
                        return console.log(`(${interaction.guild.name}) An error occurred while starting activity id ${interaction.values[0]}`);
                    }
                    interaction.channel.send(`${interaction.member} https://discord.com/invite/${invite.code}`);
                    interaction.deferUpdate();
                });
            } catch (err) {
                console.log(`(${interaction.guild.name}) An error occurred while starting activity id ${interaction.values[0]}`);
            }
        }
    }
});