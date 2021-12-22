const Discord = require("discord.js");
const Command = require("./command.js");
const Event = require("./event.js");
const { Player } = require("discord-player");
const { musicEvents } = require("./music.js")
const config = require("../config.js");
const fs = require("fs");
const { Lyrics } = require("@discord-player/extractor");

class Client extends Discord.Client {
	constructor() {
		config.prefix = process.env.PREFIX || config.prefix;
		config.bottoken = process.env.BOTTOKEN || config.bottoken;
		config.geniusapitoken = process.env.GENIUSAPITOKEN || config.geniusapitoken;

		super({	intents: [
			Discord.Intents.FLAGS.GUILDS,
			Discord.Intents.FLAGS.GUILD_MESSAGES,
			Discord.Intents.FLAGS.GUILD_VOICE_STATES
		]});

		this.commands = new Discord.Collection();
		this.player = new Player(this);
		this.requiredVoicePermissions = [
            "VIEW_CHANNEL",
            "CONNECT",
            "SPEAK"
        ];
		this.requiredTextPermissions = [
			"VIEW_CHANNEL",
			"SEND_MESSAGES",
			"READ_MESSAGE_HISTORY",
			"ADD_REACTIONS",
			"EMBED_LINKS"
		];
		this.prefix = config.prefix;
	}

	init(token) {
		if(config.bottoken === "BOT TOKEN HERE" || config.bottoken === "" || !config.bottoken)
			return console.error("--- ERROR: Bot token is empty! Make sure to fill this out in config.js");

		// command handler
		const commandFiles = fs.readdirSync("./commands")
			.filter(file => file.endsWith(".js"));
		const commands = commandFiles.map(file => require(`../commands/${file}`));
		let count = 0;
		commands.forEach(cmd => {
			count++;
			this.commands.set(cmd.name, cmd);
		});
		console.log(`${count} commands loaded.`);

		// event handler
		this.removeAllListeners();
		count = 0;
		fs.readdirSync("./events")
			.filter(file => file.endsWith(".js"))
			.forEach(file => {
				count++;
				const event = require(`../events/${file}`);
				this.on(event.event, event.run.bind(null, this));
			});
		console.log(`${count} events loaded.`);

		// discord-player
		musicEvents(this.player);
		this.lyrics = Lyrics.init(config.geniusapitoken);
		if(config.geniusapitoken === "NOTOKEN" || config.geniusapitoken === "" || !config.geniusapitoken)
			console.log("No Genius API token provided. Lyrics feature might not work properly.");

		this.login(token);
	}
}

module.exports = Client;