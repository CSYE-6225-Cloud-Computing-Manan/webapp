require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log("process.DB_NAME: " + process.env.DB_NAME);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, 
      { 
            host: process.env.DB_HOST, dialect: process.env.DB_DIALECT
      }
);

const bootstrapConnection = async () => {
      try {
            //await sequelize.authenticate();
            await sequelize.sync();
            console.log('Connection to the database and insync established successfully.');
      } catch( error ){
            console.log('Error while bootstrapping the database: ', error);
            return error;
      }
};

module.exports = {sequelize, bootstrapConnection};