module.exports = async(client) => {
    client.user.setActivity(client.config.discord.activity(client));
};