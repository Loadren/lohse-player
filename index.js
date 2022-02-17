const Client = require("./structures/client.js");

let config = {};

try {
	config = require("./config.js");
} catch (e) {
	console.log("Config file not found, using environment variables.")
}

config.bottoken = process.env.bottoken || config.bottoken;

const client = new Client();

client.init(config.bottoken);