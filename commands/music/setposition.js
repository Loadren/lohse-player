module.exports = {
    name: 'setposition',
    aliases: ['sp'],
    category: 'Music',
    utilisation: '{prefix}setposition [time in seconds]',

    execute(client, message, args) {
        if (!message.member.voice.channel) return message.channel.send(`${client.emotes.error} - You're not in a voice channel !`);

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`${client.emotes.error} - You are not in the same voice channel !`);

        if (!client.player.getQueue(message)) return message.channel.send(`${client.emotes.error} - No music currently playing !`);

        if (!args[0]) return message.channel.send(`${client.emotes.error} - Please indicate by how many seconds must the song start (in seconds) !`);

        if (isNaN(args[0])) return message.channel.send(`${client.emotes.error} - Please indicate by how many seconds must the song start (in seconds) !`);

        client.player.setPosition(message, args[0]*1000);

        message.channel.send(`${client.emotes.success} - You set the music to ${args[0]} seconds !`);
    },
};