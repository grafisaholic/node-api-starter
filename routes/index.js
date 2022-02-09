const app = require('express').Router();

app.use('/api/v1', require('./v1/index'))

module.exports = app;