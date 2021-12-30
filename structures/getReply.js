module.exports = async function getReply(channel, user, timeout){

    return new Promise((resolve, reject) => {
        var reply = null;
        const filter = (m) => m.author.id === user.id;
    
        const collector = channel.createMessageCollector({
            filter: filter,
            max: 1,
            time: timeout*1000
        });
    
        collector.on('collect', async (m) => {
            reply = m;
        });
      
        collector.on('end', (collected, reason) => {
            if(reason == "time")
                resolve(null);

            resolve(reply);
        });
    });
}