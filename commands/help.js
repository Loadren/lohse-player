const Command = require("../structures/command.js");
const { MessageEmbed } = require('discord.js');
module.exports = new Command({
	name: "help",
	aliases: [],
	description: "Displays all server commands",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const embed = new MessageEmbed();
        embed.setColor('#44b868');
        embed.setDescription(`**Commands:**\n
        - **clear** : Clears the queue
        - **disconnect / dc** : Disconnects the bot
        - **loop (off, track, queue, autoplay)** : Defines the loop type
        - **nowplaying / np** : Check what's playing right now
        - **pause** : Pauses the music
        - **play / p** : Plays a music from YouTube
        - **previous / prev / back** : Plays the previous track
        - **queue / q** : Displays the server queue
        - **remove / r** : Removes a song from the queue
        - **resume** : Resumes the queue if it is paused
        - **skip / next / n** : Skips to the next song in the queue
        - **singforme / sfm** : Tells the bot to sing for you
	- **volume / vol** : Adjusts the bot volume
        - **report** : Reports a bug or make a suggestion`);
        return message.channel.send({ embeds: [embed] });
	}
});
