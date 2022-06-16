const logger = require("../../libs/logs");

function Welcome() {
	this.index = (req, res) => {
		return res.status(200).json({
			status: 200,
			message: "Welcome backend api starter, nice to meet you !",
		});
	};

	this.samplePost = (req, res) => {
		const { body } = req;

		logger.debug(body);
		return res.json(body);
	};
}

module.exports = Welcome;
