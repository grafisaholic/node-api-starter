const logger = require("node-color-log");

const success = (message) => {
	logger.color("green").success(message);
};

const warning = (message) => {
	logger.color("yellow").warn(message);
};

const info = (message) => {
	logger.color("green").info(message);
};

const danger = (message) => {
	logger.color("red").error(message);
};

const primary = (message) => {
	logger.color("white").log(message);
};

const debug = (message) => {
	logger.color("cyan").debug(message);
};

module.exports = {
	success,
	warning,
	info,
	danger,
	primary,
	debug,
};
