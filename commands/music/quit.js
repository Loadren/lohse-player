module.exports = {
    name: 'quit',
    aliases: ['q'],
    category: 'Music',
    utilisation: '{prefix}quit or {prefix}q',

    execute(client, message) {
        if (message.guild.me.voice.channel) {
            message.guild.me.voice.channel.leave();
        }
    },
};