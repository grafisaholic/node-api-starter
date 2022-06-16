const app = require("express")();
const mode = process.env.NODE_ENV || "development";
const cors = require("cors");
const bodyParser = require("body-parser");
const loggerPath = require("morgan");
const mongoose = require("mongoose");
const logger = require("./libs/logs");

function InitServer() {
	this.app = app;

	this.run = function (server) {
		const config = require("./config/app.json")[mode];
		const host = config.app.host;
		const port = config.app.port;

		server.use(cors());
		server.use(bodyParser.json());
		server.use(bodyParser.urlencoded({ extended: true }));

		if (mode == "development") {
			server.use(loggerPath("dev"));
		}

		server.use(require("./routes/index"));
		server.listen(port, host, () =>
			logger.info(`Application listen on host ${host} port ${port}`)
		);
	};

	this.initDatabase = function (callback) {
		const configDB = require("./config/database.json")[mode];
		const authConnetion =
			configDB.password != ""
				? configDB.username + ":" + configDB.password + "@"
				: "";

		mongoose
			.connect(
				`mongodb://${authConnetion}${configDB.host}:${configDB.port}/${configDB.db}`
			)
			.then((db) => {
				logger.info(
					`Database connected on host ${configDB.host} port ${configDB.port}`
				);
				callback(null, db);
			})
			.catch((err) => {
				callback(err, null);
			});
	};

	this.initRedis = function () {
		const configRedis = require("./config/redis.json")[mode];
		const hostRedis = configRedis.host;
		const portRedis = configRedis.port;
		const dbRedis = configRedis.db;

		const kue = require("kue");
		const queue = kue.createQueue({
			redis: {
				host: hostRedis,
				port: portRedis,
				db: dbRedis,
			},
		});

		// LISTEN QUEUE
		global.queue = queue;
		kue.app.set("title", "My Application");
		kue.app.listen(3001);

		process.on("uncaughtException", function (err) {
			// console.error( 'Something bad happened: ', err );
			queue.shutdown(1000, function (err2) {
				logger.danger(
					`Shutdown redis queue, error : ${err2 || "nothing error !"}`
				);
				process.exit(0);
			});
		});

		[
			`exit`,
			`SIGINT`,
			`SIGUSR1`,
			`SIGUSR2`,
			`uncaughtException`,
			`SIGTERM`,
		].forEach((eventType) => {
			process.once(eventType, (sig) => {
				logger.danger(`Application terminated, event: ${sig}`);

				queue.active(function (err, ids) {
					ids.forEach(function (id) {
						kue.Job.get(id, function (err, job) {
							// Your application should check if job is a stuck one
							job.remove();
						});
					});
				});
				queue.inactive(function (err, ids) {
					ids.forEach(function (id) {
						kue.Job.get(id, function (err, job) {
							// Your application should check if job is a stuck one
							job.remove();
						});
					});
				});
				queue.shutdown(5000, function (err) {
					logger.danger(
						`Shutdown redis queue, error : ${err || "nothing error !"}`
					);
				});
			});
		});

		logger.info(`Redis connected on host ${hostRedis} port ${portRedis}`);
	};
}

module.exports = InitServer;
