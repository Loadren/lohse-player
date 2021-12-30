const Discord = require("discord.js");

class EndTimeout {
    constructor(_leaveOnEndCooldown) {
        this.leaveOnEndCooldown = _leaveOnEndCooldown || 5;
        this.timeouts = new Map();
    }

    setTimeout(queue) {
        let timeout = setTimeout(async () => {
            queue.connection.disconnect();
            queue.destroy(true);
            await queue.metadata.channel.send({embeds: [new Discord.MessageEmbed()
                    .setColor('#ffff66')
                    .setDescription('Show is over, disconnected from channel!')]
            });
        }, this.leaveOnEndCooldown * 1000);
        this.timeouts.set(queue.guild.id, timeout);
    }

    clearTimeout(queue) {
        let timeout = this.timeouts.get(queue.guild.id);
        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(queue.guild.id);
        }
    }
}

module.exports = EndTimeout;