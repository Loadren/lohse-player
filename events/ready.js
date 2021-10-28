module.exports = async(client) => {
    console.log(`Logged in as ${client.user.username}. Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);

    if (client.config.isMaintenance)
        client.user.setActivity("MAINTENANCE.")
    else
        client.user.setActivity(client.config.discord.activity(client));
};