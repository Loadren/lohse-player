const Command = require("../structures/command.js");
const { QueueRepeatMode } = require('discord-player');

module.exports = new Command({
	name: "skip",
    aliases: ['n', 'next'],
	description: "Skips to the next song in the queue",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        const queue = client.player.getQueue(message.guild);
        if (!queue || !queue.playing) return;

        var success;

        if (queue.repeatMode) {
            var repeatMode = queue.repeatMode;

            queue.setRepeatMode(QueueRepeatMode.OFF);
            success = queue.skip(message);

            // Here, we set a Timeout because there's an event each second checking for a property to skip songs. Need to match that.
            setTimeout(function() {
                queue.setRepeatMode(repeatMode);
            }, 1000)
        } else {
            success = queue.skip(message);
        };

        return success ? message.react("⏭️") : message.react('❌');
	}
});