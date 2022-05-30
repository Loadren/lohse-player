const Command = require("../structures/command.js");
const { QueryType } = require('discord-player');

module.exports = new Command({
	name: "play",
    aliases: ['p'],
	description: "Plays the song specified",
	permission: "SEND_MESSAGES",
	async run(message, args, client) {
        if(!message.member.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in a voice channel!`, color: 0xb84e44 }] });
        if(message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
            return message.reply({ embeds: [{ description: `You are not in my voice channel!`, color: 0xb84e44 }] });
        if(!args[1]) {
            const queue = client.player.getQueue(message.guild);
            if(queue && queue.playing) { // resume
                const paused = queue.setPaused(false);
                if(paused) message.react('▶️');
            }
            return;
        }
        
        if(!message.guild.me.permissionsIn(message.member.voice.channel).has(client.requiredVoicePermissions)) return;

        let query = args.slice(1).join(" ");
        const searchResult = await client.player.search(query, { requestedBy: message.author, searchEngine: QueryType.AUTO })
        if (!searchResult || !searchResult.tracks.length)
            return message.channel.send({ embeds: [{ description: `No results found!`, color: 0xb84e44 }] });

        
        var queue = client.player.getQueue(message.guild); // Need to get the queue even if undefined to check if already in vocal. No need to recreate the queue

        if(!queue)
            queue = await client.player.createQueue(message.guild,{ metadata: { channel: message.channel },

                bufferingTimeout: 1000,
                disableVolume: false, // disabling volume controls can improve performance
                leaveOnEnd: false,
                leaveOnStop: true,
                leaveOnEmpty: true
            });
        let justConnected;
        try {
            if (!queue.connection) {
                justConnected = true;
                await queue.connect(message.member.voice.channel);
            }
        } catch {
            client.player.deleteQueue(message.guild);
            return message.channel.send({ embeds: [{ description: `Could not join your voice channel!`, color: 0xb84e44 }] });
        }
        if(searchResult.playlist) searchResult.tracks[0].playlist = searchResult.playlist;
        await searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
        if(justConnected || !queue.playing) queue.play(); // Here to check if already in vocal or just Connected.
	}
});
