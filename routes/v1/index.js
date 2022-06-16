const app = require("express").Router();

const WelcomeHandler = require("./welcome"),
	Welcome = new WelcomeHandler();

app.get("/", Welcome.index);
app.post("/", Welcome.samplePost);

module.exports = app;
