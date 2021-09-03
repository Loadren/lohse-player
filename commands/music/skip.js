module.exports = {
    name: 'skip',
    aliases: ['sk'],
    category: 'Music',
    utilisation: '{prefix}skip',

    execute(client, message) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        if (message.content.split(" ").length > 1) {

            const trackNumber = parseInt(message.content.split(" ")[1]);

            if (trackNumber !== NaN) {

                const track = client.player.remove(message, trackNumber);

                if (track === undefined) return message.channel.send(`${client.emotes.error} - No track has been found in that position in queue.`);

                if (track === false) return message.channel.send(`${client.emotes.error} - There's no track in queue.`);

                if (track) return message.channel.send(`${client.emotes.success} - The track \`${track.title}\` has just been **skipped** !`);

                return message.channel.send(`${client.emotes.error} - An error occured. Please try again.`);

            } else {

                return message.channel.send(`${client.emotes.error} - Please enter a valide track number to skip songs in queue.`);
            }
        }

        const success = client.player.skip(message);

        if (success) message.channel.send(`${client.emotes.success} - The current music has just been **skipped** !`);
    },
};