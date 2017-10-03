const {
	white,
	red,
	green
} = require("chalk"),
	moment = require("moment");

module.exports = (client) => {

	client.success = (reason) => {
		return console.log(green(`[SUCCESS] ${reason}`))
	}

	client.error = (reason, error) => {
		if (error) return console.log(red(`[ERROR] Occured while ${reason}\n${white(error)}`))
		else return console.log(red(`[ERROR] Occured while ${reason}`))
	}

	client.format = (milliseconds) => {
		return moment(milliseconds).format("dddd, M/D/YY h:mm A");
	}

	client.dupes = require("../../data/duplicated.json");

}