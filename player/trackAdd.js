module.exports = (client, message, queue, track) => {
    if (track.url != "https://www.youtube.com/watch?v=yQ_g_GN7LAs")
        message.channel.send(`${client.emotes.music} - ${track.title} has been added to the queue !`);
};