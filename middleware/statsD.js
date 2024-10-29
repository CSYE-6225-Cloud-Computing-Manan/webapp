const Client = require('node-statsd');
const client = new Client({ host: "localhost", port: 8125, socketTimeout: 3000});

module.exports = client;