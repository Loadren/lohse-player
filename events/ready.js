const Event = require("../structures/event.js");

module.exports = new Event("ready", client => {
	console.log("--------- Lohse is ready! ---------");
	client.user.setActivity(`MAINTENANCE`, { type: 'LISTENING' });
});