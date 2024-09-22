const { Sequelize } = require('sequelize');

console.log("process.DB_NAME: " + process.env.DB_NAME);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, { DB_HOST, DB_DIALECT});

module.exports = sequelize;