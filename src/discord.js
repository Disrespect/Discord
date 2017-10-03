const config = require("./config")

const Discord = require("discord.js")
const snekfetch = require("snekfetch")
const fs = require("fs")
const client = new Discord.Client()

require("./modules/functions.js")(client)
const types = [
	"png",
	"jpeg",
	"jpg",
	"gif"
]

client.on("ready", async () => {
	client.success("Connected to Discord API")
	client.user.setPresence({
		status : config.client.presence.status,
		game : {
			name : config.client.presence.game
		}
	})

	client.setInterval(function() {
		snekfetch.get(`https://www.reddit.com/r/${config.reddit}/new.json`).then(bodyData => {
			const data = bodyData.body.data.children[0].data;

			if (types.some(type => data.url.includes(type))) {

				if (!client.dupes.duplicated.includes(data.url)) {

					client.dupes.duplicated.push(data.url);

				 	fs.writeFile("./data/duplicated.json", JSON.stringify(client.dupes, null, 4), err => {
				 		if (err) client.error("saving duplicated in json", err.stack);
				 	});	

				 	client.channels.get(config.channel).send("", { embed : new Discord.RichEmbed()
				 		.setDescription(`Detected new post at [/r/${config.reddit}](https://reddit.com/r/${config.reddit})`)
				 		.setImage(data.url)
				 		.setColor(config.client.color)
				 		.setFooter(`Posted by ${data.author} @ ${client.format(Date.now() + data.created)}`)
				 	}).then(() => {
				 		client.success("Posted " + data.url);
				 	})		
				} else {
					client.error(`attempting to post ${data.url} , but was already posted. Declined.`);
				}
			}
		}).catch(err => {
			if (err) client.error("grabbing new reddit json data", err.stack);
		})
	}, 30 * 60 * 1000)
})

client.login(config.client.token);