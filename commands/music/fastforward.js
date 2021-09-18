module.exports = {
    name: 'fastforward',
    aliases: ['ff'],
    category: 'Music',
    utilisation: '{prefix}fastforward [time in seconds]',

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Please indicate by how much you want to fast forward the song (in seconds) !`);

        if (isNaN(args[0])) return message.channel.send(`${client.emotes.error} - Please indicate by how much you want to fast forward the song (in seconds) !`);

        var guildID = message.guildID;
        var time = client.player.queues.get(guildID);

        time = (time != undefined) ? time.currentStreamTime : undefined;

        if (!time) return message.channel.send(`${client.emotes.error} - An error occured.`);

        client.player.setPosition(message, time + args[0] * 1000);

        message.channel.send(`${client.emotes.success} - You fast forwarded ${args[0]} seconds !`);
    },
};