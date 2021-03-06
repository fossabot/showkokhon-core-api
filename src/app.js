const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const schedule = require('./routes/schedule');
const admin = require('./routes/admin');
const dbStatus = require('./routes/status');

require('./config/config');
require('./db/db');


// cron job
require('./util/cronjob');

const port = process.env.PORT || 3000;

const app = express();

// add middlewares
app.use(bodyParser.json());
app.use(morgan('combined'));

// configure CORS
const allowedOrigins = [
  process.env.REQ_ORIGIN_WEBSITE,
];
app.use(cors({
  origin: (origin, callback) => {
    // allowing mobile apps or curl
    if (!origin) {
      return callback(null, true);
    }
    // error!
    if (allowedOrigins.indexOf(origin) === -1) {
      const err = new Error('CORS:: Origin rejected');
      return callback(err, false);
    }

    // trusted origin only for xhr
    return callback(null, true);
  },
}));

// routers
app.use('/core/v1/schedule', schedule);
app.use('/admin', admin);
app.use('/status', dbStatus);

// index
app.get('/', (req, res) => {
  res.status(200).send({
    msg: 'Showkokohon-Core-API',
    sentAt: new Date().toISOString(),
  });
});

// root route
app.get('/core/v1/', (req, res) => {
  res.status(200).send({
    msg: 'Showkokohon-Core-API',
    version: 'v1',
    sentAt: new Date().toISOString(),
  });
});


app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`server running @ ${port}`);
});

module.exports = app;
