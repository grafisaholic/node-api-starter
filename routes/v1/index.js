const app = require('express').Router();

const WelcomeHandler = require('./welcome'), Welcome = new WelcomeHandler();

app.use('/', Welcome.index);

module.exports = app;