module.exports = {
    name: 'roll',
    aliases: ['r'],
    category: 'Roll',
    utilisation: '{prefix}roll',

    execute(client, message, args) {

        var dices = message.content.split(' ')[1];
        var sum = 0;
        var returnMessage = "(";

        if(!dices) return message.channel.send(`${client.emotes.error} - Can't understand the command. Please respect the synthaxe (for example, "-roll 1D40" or "-roll 10d20")`);

        var diceNumber = dices.toLowerCase().split('d')[0];
        var diceFaces = dices.toLowerCase().split('d')[1];

        if(isNaN(diceNumber) || isNaN(diceFaces)) return message.channel.send(`${client.emotes.error} - Can't understand the command. Please respect the synthaxe (for example, "-roll 1D40" or "-roll 10d20")`);

        if(diceNumber == 1) return message.reply(`${client.emotes.success} - You rolled **${Math.floor(Math.random() * (diceFaces - 1 + 1) + 1)}**.`);

        for (let i = 0; i < diceNumber; i++) {
            var roll = Math.floor(Math.random() * (diceFaces - 1 + 1) + 1)
            sum += roll;
            returnMessage += roll + " + "
        }
        
        return message.reply(`${client.emotes.success} - You rolled **${sum}**${sum == 69 || sum == 420 ? " *(NICE !)*" : ""}. ${returnMessage.substring(0, returnMessage.lastIndexOf(' + '))} = ${sum})`);

    },
};