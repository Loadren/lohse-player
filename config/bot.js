module.exports = {
    emojis: {
        off: ':x:',
        error: ':warning:',
        queue: ':bar_chart:',
        music: ':musical_note:',
        success: ':white_check_mark:',
    },

    discord: {
        token: 'ODgzMDA5NjcwMzE3NDk4Mzcy.YTDs1g.dO0p1k5hMB3snQws-beUAQNYJo8',
        prefix: '-',
        activity: (client) => {
            return console.log(`Ready to sing along on ${client.guilds.cache.size} servers!`);
        }
    },

    filters: ['4D', '8D', 'gate', 'haas', 'phaser', 'treble', 'tremolo', 'vibrato', 'reverse', 'karaoke', 'flanger', 'mcompand', 'pulsator', 'subboost', 'bassboost', 'vaporwave', 'nightcore', 'normalizer', 'surrounding'],
};