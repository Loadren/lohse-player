const EndTimeout = require("./endTimeout.js");

class PlayerHandler {
    constructor(){
        this.endTimeout = new EndTimeout(120);
    }

    setHandler(player){
        player
        .on('trackAdd', (queue, track) => {
            this.endTimeout.clearTimeout(queue);
        })
        .on('tracksAdd', (queue, track) => {
            this.endTimeout.clearTimeout(queue);
        })
        .on('channelEmpty', (queue => {
            this.endTimeout.clearTimeout(queue);
        }))
        .on('queueEnd', (queue => {
            this.endTimeout.setTimeout(queue);
        }))
        .on('botDisconnect', (queue => {
            this.endTimeout.clearTimeout(queue);
        }))
        ;
    }
}

module.exports = PlayerHandler;