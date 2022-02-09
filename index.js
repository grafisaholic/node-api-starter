const app = require('express')();
const mode = process.env.NODE_ENV || 'dev';
const cors = require('cors');
const bodyParser = require('body-parser');

const configApp = require('./config/app.json')[mode || 'dev'];

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./routes/index'));

app.listen(configApp.port, configApp.host, () => console.log(`Application listen on host ${configApp.host} port ${configApp.port}`));